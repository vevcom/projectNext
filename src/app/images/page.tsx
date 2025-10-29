import styles from './page.module.scss'
import MakeNewCollection from './MakeNewCollection'
import ImageCollectionList from '@/components/Image/Collection/ImageCollectionList'
import { ImageCollectionPagingProvider } from '@/contexts/paging/ImageCollectionPaging'
import CollectionCard from '@/components/Image/Collection/CollectionCard'
import { readImageCollectionsPageAction } from '@/services/images/collections/actions'
import { Session } from '@/auth/session/Session'
import type { PageSizeImageCollection } from '@/contexts/paging/ImageCollectionPaging'

export default async function Images() {
    const { user } = await Session.fromNextAuth()

    const isAdmin = user?.username === 'harambe' //TODO: temp
    const pageSize: PageSizeImageCollection = 12

    const collectionPage = await readImageCollectionsPageAction({
        page: {
            pageSize,
            page: 0,
            cursor: null
        },
        details: undefined,
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
                        {isAdmin && <MakeNewCollection />}
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
