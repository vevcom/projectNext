import styles from './page.module.scss'
import CollectionAdmin from './CollectionAdmin'
import ImageList from '@/components/Image/ImageList/ImageList'
import ImagePagingProvider from '@/contexts/paging/ImagePaging'
import ImageListImage from '@/components/Image/ImageList/ImageListImage'
import ImageDisplayProvider from '@/contexts/ImageDisplayProvider'
import { readImageCollectionAction } from '@/services/images/collections/actions'
import { readImagesPageAction } from '@/services/images/actions'
import { notFound } from 'next/navigation'
import type { PageSizeImage } from '@/contexts/paging/ImagePaging'

type PropTypes = {
    params: Promise<{
        id: string
    }>
}

export default async function Collection({ params }: PropTypes) {
    const pageSize: PageSizeImage = 30

    const readCollection = await readImageCollectionAction(Number((await params).id))
    if (!readCollection.success) notFound() //TODO: replace with better error page if error is UNAUTHORIZED.
    const collection = readCollection.data

    const readImages = await readImagesPageAction.bind(null, {
        paging: {
            page: { pageSize, page: 0, cursor: null },
            details: { collectionId: collection.id }
        }
    })()
    if (!readImages.success) notFound()
    const images = readImages.data

    return (
        <ImagePagingProvider
            startPage={{
                pageSize,
                page: 1,
            }}
            details={{ collectionId: collection.id }}
            serverRenderedData={images}
        >
            <ImageDisplayProvider>
                <div className={styles.wrapper}>
                    <h1>{collection.name}</h1>
                    <i>{collection.description}</i>
                    <main>
                        <ImageList serverRendered={
                            images.map(image => <ImageListImage key={image.id} image={image} />)
                        } />
                    </main>
                    <CollectionAdmin visibility={collection.visibility} collection={collection} />
                </div>
            </ImageDisplayProvider>
        </ImagePagingProvider>
    )
}
