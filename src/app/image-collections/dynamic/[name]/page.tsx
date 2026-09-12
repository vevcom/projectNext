import DynamicCollectionPanel from './DynamicCollectionPanel'
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

    // The page chrome lives in DynamicCollectionPanel: the admin controls go in the wrapper's
    // header slot and the image panel they refresh in its body, so both have to be rendered from
    // the same client component.
    return <DynamicCollectionPanel collection={collection} doubleLevelVisibility={doubleLevelVisibility} />
}
