import { notFound } from 'next/navigation'
import styles from './page.module.scss'
import CollectionAdmin from './CollectionAdmin'
import read from '@/actions/images/collections/read'
import ImageCollectionList from '@/components/Image/ImageCollectionList'
import ScrollImageProvider, { PageSizeImageCollection } from '@/components/EndlessScroll/ScrollImageCollection'

type PropTypes = {
    params: {
        id: string
    }
}

export default async function Collection({ params } : PropTypes) {
    const pageSize : PageSizeImageCollection = 30;

    const { success, data: collection } = await read({page: {pageSize, page: 0}, details: {id: Number(params.id)}})
    if (!success || !collection) notFound()
    const isAdmin = true //temp

    return (
        <div className={styles.wrapper}>
            {isAdmin &&
                <aside className={styles.admin}>
                    <CollectionAdmin collectionId={collection.id} />
                </aside>
            }
            <div className={styles.images}>
                <h1>{collection.name}</h1>
                <i>{collection.description}</i>
                <main>
                    <ScrollImageProvider 
                        startPage={{
                            pageSize: pageSize,
                            page: 1,
                        }} 
                        initialData={collection.images}>
                            <ImageCollectionList collection={collection} />
                    </ScrollImageProvider>
                </main>
            </div>
        </div>
    )
}
