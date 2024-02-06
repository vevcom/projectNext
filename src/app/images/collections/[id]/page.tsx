import styles from './page.module.scss'
import CollectionAdmin from './CollectionAdmin'
import { readImagesPage } from '@/actions/images/read'
import { readImageCollection } from '@/actions/images/collections/read'
import ImageList from '@/app/components/Image/ImageList/ImageList'
import ImagePagingProvider from '@/context/paging/ImagePaging'
import ImageSelectionProvider from '@/context/ImageSelection'
import PopUpProvider from '@/context/PopUp'
import ImageListImage from '@/components/Image/ImageList/ImageListImage'
import { getUser } from '@/auth'
import { notFound } from 'next/navigation'
import type { PageSizeImage } from '@/context/paging/ImagePaging'

type PropTypes = {
    params: {
        id: string
    }
}

export default async function Collection({ params }: PropTypes) {
    const user = await getUser()

    const pageSize: PageSizeImage = 30

    const readCollection = await readImageCollection(Number(params.id))
    if (!readCollection.success) notFound()
    const collection = readCollection.data

    const readImages = await readImagesPage({ page: { pageSize, page: 0 }, details: { collectionId: collection.id } })
    if (!readImages.success) notFound()
    const images = readImages.data
    const isAdmin = user?.username === 'Harambe104' //temp

    return (
        <ImageSelectionProvider>
            <ImagePagingProvider
                startPage={{
                    pageSize,
                    page: 1,
                }}
                details={{ collectionId: collection.id }}
                serverRenderedData={images}
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
                                <ImageList serverRendered={
                                    images.map(image => <ImageListImage key={image.id} image={image} />)
                                } />
                            </main>
                        </div>
                    </div>
                </PopUpProvider>
            </ImagePagingProvider>
        </ImageSelectionProvider>
    )
}
