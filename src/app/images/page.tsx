import styles from './page.module.scss'
import MakeNewCollection from './MakeNewCollection'
import { readPage } from '@/actions/images/collections/read'
import type { PageSizeImageCollection } from '@/context/paging/ImageCollectionPaging'
import ImageCollectionList from '../components/Image/Collection/ImageCollectionList'
import ImageCollectionPagingProvider from '@/context/paging/ImageCollectionPaging'
import CollectionCard from '@/components/Image/Collection/CollectionCard'

export default async function Images() {
    const isAdmin = true //temp
    const pageSize : PageSizeImageCollection = 12

    const { success, data: collections = [], error } = await readPage({
        page: {
            pageSize,
            page: 0
        },
        details: null,
    })
    if (!success) throw error ? error[0].message : new Error('Unknown error')

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <ImageCollectionPagingProvider
                    startPage={{
                        pageSize,
                        page: 1,
                    }}
                    details={null}
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
