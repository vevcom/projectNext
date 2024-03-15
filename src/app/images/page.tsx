import styles from './page.module.scss'
import MakeNewCollection from './MakeNewCollection'
import ImageCollectionList from '@/components/Image/Collection/ImageCollectionList'
import { readImageCollectionsPageAction } from '@/actions/images/collections/read'
import ImageCollectionPagingProvider from '@/context/paging/ImageCollectionPaging'
import CollectionCard from '@/components/Image/Collection/CollectionCard'
import { getUser } from '@/auth/getUser'
import type { PageSizeImageCollection } from '@/context/paging/ImageCollectionPaging'

export default async function Images() {
    const { user } = await getUser()

    const isAdmin = user?.username === 'Harambe104' //temp
    const pageSize: PageSizeImageCollection = 12

    const collectionPage = await readImageCollectionsPageAction({
        page: {
            pageSize,
            page: 0
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
