import { notFound } from 'next/navigation'
import styles from './page.module.scss'
import CollectionAdmin from './CollectionAdmin'
import read from '@/actions/images/read'
import ImageCollectionList from '@/components/Image/ImageCollectionList'
import ImageContextProvider, { PageSizeImage } from '@/context/paging/ImagePaging'

type PropTypes = {
    params: {
        id: string
    }
}

export default async function Collection({ params } : PropTypes) {
    const pageSize : PageSizeImage = 30;

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
                    <ImageContextProvider
                        startPage={{
                            pageSize: pageSize,
                            page: 1,
                        }} 
                        initialData={collection.images}>
                            <ImageCollectionList collection={collection} />
                    </ImageContextProvider>
                </main>
            </div>
        </div>
    )
}
