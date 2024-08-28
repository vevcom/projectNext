import styles from './page.module.scss'
import CollectionAdmin from './CollectionAdmin'
import { readImagesPageAction } from '@/actions/images/read'
import { readImageCollectionAction } from '@/actions/images/collections/read'
import ImageList from '@/components/Image/ImageList/ImageList'
import ImagePagingProvider from '@/contexts/paging/ImagePaging'
import ImageSelectionProvider from '@/contexts/ImageSelection'
import PopUpProvider from '@/contexts/PopUp'
import ImageListImage from '@/components/Image/ImageList/ImageListImage'
import { notFound } from 'next/navigation'
import type { PageSizeImage } from '@/contexts/paging/ImagePaging'

type PropTypes = {
    params: {
        id: string
    }
}

export default async function Collection({ params }: PropTypes) {
    const pageSize: PageSizeImage = 30

    const readCollection = await readImageCollectionAction(Number(params.id))
    if (!readCollection.success) notFound() //TODO: replace with better error page if error is UNAUTHORIZED.
    const collection = readCollection.data

    const readImages = await readImagesPageAction({
        page: { pageSize, page: 0, cursor: null },
        details: { collectionId: collection.id }
    })
    if (!readImages.success) notFound()
    const images = readImages.data

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
                        <CollectionAdmin visibility={collection.visibility} collection={collection} />
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
