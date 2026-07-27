import styles from './page.module.scss'
import DynamicCollectionPanel from './DynamicCollectionPanel'
import DoubleLevelVisibilityDescription
    from '@/components/Visibility/DoubleLevelVisibilityDescription/DoubleLevelVisibilityDescription'
import {
    readDynamicImageCollectionAction,
    readDynamicImageCollectionDoubleLevelVisibilityAction,
} from '@/services/images/dynamic/actions'
import { notFound } from 'next/navigation'

type PropTypes = {
    params: Promise<{
        name: string
    }>
}

export default async function Collection({ params }: PropTypes) {
    const collectionName = decodeURIComponent((await params).name)

    const readCollection = await readDynamicImageCollectionAction({ params: { collectionName } })
    if (!readCollection.success) notFound() //TODO: replace with better error page if error is UNAUTHORIZED.
    const collection = readCollection.data

    const readDoubleLevelVisibility = await readDynamicImageCollectionDoubleLevelVisibilityAction({
        params: { collectionId: collection.id }
    })
    const doubleLevelVisibility = readDoubleLevelVisibility.success ? readDoubleLevelVisibility.data : null

    return (
        <div className={styles.wrapper}>
            <h1>{collection.name}</h1>
            <i>{collection.description}</i>
            {
                doubleLevelVisibility && (
                    <DoubleLevelVisibilityDescription doubleLevelVisibility={doubleLevelVisibility} />
                )
            }
            <DynamicCollectionPanel collection={collection} doubleLevelVisibility={doubleLevelVisibility} />
        </div>
    )
}
