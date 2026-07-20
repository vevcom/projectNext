import styles from './page.module.scss'
import MakeNewCollection from './MakeNewCollection'
import ImageCollectionList from '@/components/Image/Collection/ImageCollectionList'
import { ImageCollectionPagingProvider } from '@/contexts/paging/ImageCollectionPaging'
import CollectionCard from '@/components/Image/Collection/CollectionCard'
import { ServerSession } from '@/auth/session/ServerSession'
import { dynamicImageAuth } from '@/services/images/dynamic/auth'
import { readImageCollectionsPageAction } from '@/services/images/dynamic/actions'
import type { PageSizeImageCollection } from '@/contexts/paging/ImageCollectionPaging'

export default async function Images() {
    const session = await ServerSession.fromNextAuth()
    const canCreateCollection = dynamicImageAuth.createCollection.dynamicFields({ }).auth(session)
    const pageSize: PageSizeImageCollection = 12

    const collectionPage = await readImageCollectionsPageAction({
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
                <ImageCollectionPagingProvider
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
                </ImageCollectionPagingProvider>
            </div>
        </div>
    )
}
