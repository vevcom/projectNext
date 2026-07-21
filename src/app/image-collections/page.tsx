import styles from './page.module.scss'
import MakeNewCollection from './MakeNewCollection'
import ImageCollectionList from './ImageCollectionList'
import { DynamicImageCollectionPagingProvider } from '@/contexts/paging/DynamicImageCollectionPaging'
import CollectionCard from '@/components/Image/Collection/CollectionCard'
import { ServerSession } from '@/auth/session/ServerSession'
import { dynamicImageAuth } from '@/services/images/dynamic/auth'
import { readDynamicImageCollectionsPageAction } from '@/services/images/dynamic/actions'
import type { PageSizeDynamicImageCollection } from '@/contexts/paging/DynamicImageCollectionPaging'

export default async function Images() {
    const session = await ServerSession.fromNextAuth()
    const canCreateCollection = dynamicImageAuth.createCollection.dynamicFields({ }).auth(session)
    const pageSize: PageSizeDynamicImageCollection = 12

    const collectionPage = await readDynamicImageCollectionsPageAction({
        params: {
            paging: {
                page: {
                    pageSize,
                    page: 0,
                    cursor: null,
                },
                details: undefined,
            },
        },
    })

    if (!collectionPage.success) {
        throw collectionPage.error ? collectionPage.error[0].message : new Error('Unknown error')
    }

    const collections = collectionPage.data

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <DynamicImageCollectionPagingProvider
                    startPage={{
                        pageSize,
                        page: 1,
                    }}
                    details={undefined}
                    serverRenderedData={collections}
                >
                    <span className={styles.header}>
                        <h1>Fotogalleri</h1>
                        {canCreateCollection.authorized && <MakeNewCollection />}
                    </span>
                    <ImageCollectionList
                        serverRendered={collections.map(collection => (
                            <CollectionCard key={collection.id} collection={collection} />
                        ))}
                    />
                </DynamicImageCollectionPagingProvider>
            </div>
        </div>
    )
}
