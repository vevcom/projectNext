import styles from './page.module.scss'
import DynamicCollectionPanel from './DynamicCollectionPanel'
import { readDynamicImageCollectionAction } from '@/services/images/dynamic/actions'
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

    return (
        <div className={styles.wrapper}>
            <h1>{collection.name}</h1>
            <i>{collection.description}</i>
            <DynamicCollectionPanel collection={collection} />
        </div>
    )
}
