import { notFound } from 'next/navigation'
import styles from './page.module.scss'
import CollectionAdmin from './CollectionAdmin'
import { readPage } from '@/actions/images/read'
import read from '@/actions/images/collections/read'
import ImageCollectionList from '@/app/components/Image/Collection/ImageCollectionList'
import ImageContextProvider, { PageSizeImage } from '@/context/paging/ImagePaging'
import ImageCollectionSelectImageProvider from '@/context/ImageCollectionSelectImage'

type PropTypes = {
    params: {
        id: string
    }
}

export default async function Collection({ params } : PropTypes) {
    const pageSize : PageSizeImage = 30

    const { success, data: collection } = await read(Number(params.id))
    if (!success || !collection) notFound()

    const { success: imagesuccess, data: images } = await readPage({ page: { pageSize, page: 0 }, details: { collectionId: collection.id } })
    if (!imagesuccess || !images) notFound()
    const isAdmin = true //temp

    return (
        <ImageCollectionSelectImageProvider>
            <ImageContextProvider
                startPage={{
                    pageSize,
                    page: 1,
                }}
                initialData={images || []}
                details={{ collectionId: collection.id }}
            >
                <div className={styles.wrapper}>
                    {isAdmin &&
                        <aside className={styles.admin}>
                            <CollectionAdmin coverImage={collection.coverImage} collectionId={collection.id} name={collection.name} description={collection.description}/>
                        </aside>
                    }
                    <div className={styles.images}>
                        <h1>{collection.name}</h1>
                        <i>{collection.description}</i>
                        <main>
                            <ImageCollectionList />
                        </main>
                    </div>
                </div>
            </ImageContextProvider>
        </ImageCollectionSelectImageProvider>

    )
}
