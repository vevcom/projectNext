'use client'
import styles from './ListImagesInCollection.module.scss'
import type { Image as ImageT } from '@prisma/client'
import PopUp from '@/app/components/PopUp/PopUp'
import ImageCollectionDisplay from '@/app/components/Image/Collection/DisplayImagesInCollection/ImageCollectionDisplay'
import { default as ImageComponent } from '@/components/Image/Image'
import { useContext } from 'react'
import { ImagePagingContext } from '@/context/paging/ImagePaging'
import { ImageCollectionSelectImageContext } from '@/context/ImageCollectionSelectImage'
import EndlessScroll from '../../../PagingWrappes/EndlessScroll'
import ImageSelectionButton from './ImageSelectionButton'

function ImageWithFallback({ image }: { image: ImageT }) {
    const selection = useContext(ImageCollectionSelectImageContext)

    return (
        <div className={styles.imageAndBtn}>
            <ImageComponent width={200} image={image} />
            <PopUp showButtonContent={<></>}>
                <ImageCollectionDisplay startImageName={image.name} />
            </PopUp>
            {
                selection?.selectionMode && (
                    <ImageSelectionButton image={image} />
                )
            }
        </div>
    )
}

//Note that this component may take iniitial images as props fetched on server
export default function ListImagesInCollection() {
    const context = useContext(ImagePagingContext)

    //This component must be rendered inside a ImagePagingContextProvider
    if (!context) throw new Error('No context')

    return (
        <div className={styles.ListImagesInCollection}>
            <EndlessScroll
                pagingContext={ImagePagingContext}
                renderer={image => <ImageWithFallback key={image.id} image={image} />}
            />
        </div>
    )
}
