import { notFound } from 'next/navigation'
import styles from './page.module.scss'
import CollectionAdmin from './CollectionAdmin'
import { readPage } from '@/actions/images/read'
import read from '@/actions/images/collections/read'
import ImageList from '@/app/components/Image/ImageList/ImageList'
import ImagePagingProvider, { PageSizeImage } from '@/context/paging/ImagePaging'
import ImageSelectionProvider from '@/context/ImageSelection'
import PopUpProvider from '@/context/PopUp'

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
        <ImageSelectionProvider>
            <ImagePagingProvider
                startPage={{
                    pageSize,
                    page: 1,
                }}
                initialData={images || []}
                details={{ collectionId: collection.id }}
            >
                <PopUpProvider>
                    <div className={styles.wrapper}>
                        {isAdmin &&
                            <aside className={styles.admin}>
                                <CollectionAdmin coverImage={collection.coverImage} collectionId={collection.id} />
                            </aside>
                        }
                        <div className={styles.images}>
                            <h1>{collection.name}</h1>
                            <i>{collection.description}</i>
                            <main>
                                <ImageList />
                            </main>
                        </div>
                    </div>
                </PopUpProvider>
            </ImagePagingProvider>
        </ImageSelectionProvider>
    )
}
