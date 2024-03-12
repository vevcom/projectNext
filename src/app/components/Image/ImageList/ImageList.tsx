'use client'
import styles from './ImageList.module.scss'
import ImageListImage from './ImageListImage'
import { ImagePagingContext } from '@/context/paging/ImagePaging'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'
import React, { useContext } from 'react'

type PropTypes = {
    serverRendered?: React.ReactNode,
    disableEditing?: boolean,
}

/**
 * WARNING: This component must be rendered inside a ImagePagingContextProvider
 * This is a component that renders a list of images. It uses the ImagePagingContext to fetch more images
 * The component is designed to use ImageSelectionProvider to select images as well
 * @param serverRendered - server rendered data, should be rendered before the endless scroll i.e a list
 * of ImageListImage components
 * @param disableEditing - if true, the ImageListImage components will not be able to edit the image
 * @returns 
 */
export default function ImageList({ serverRendered, disableEditing }: PropTypes) {
    const context = useContext(ImagePagingContext)

    //This component must be rendered inside a ImagePagingContextProvider
    if (!context) throw new Error('No context')

    return (
        <div className={styles.ListImagesInCollection}>
            {serverRendered} {/* Rendered on server homefully in the right way*/}
            <EndlessScroll
                pagingContext={ImagePagingContext}
                renderer={image => <ImageListImage key={image.id} image={image} disableEditing={disableEditing}/>}
            />
        </div>
    )
}
