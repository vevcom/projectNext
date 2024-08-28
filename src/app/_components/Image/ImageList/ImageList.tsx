'use client'
import styles from './ImageList.module.scss'
import ImageListImage from './ImageListImage'
import { ImagePagingContext } from '@/contextss/paging/ImagePaging'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'
import ImageUploader from '@/components/Image/ImageUploader'
import PopUp from '@/components/PopUp/PopUp'
import React, { useCallback, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuid } from 'uuid'

type PropTypes = {
    serverRendered?: React.ReactNode,
    disableEditing?: boolean,
    withUpload?: boolean,
}

/**
 * WARNING: This component must be rendered inside a ImagePagingContextProvider
 * This is a component that renders a list of images. It uses the ImagePagingContext to fetch more images
 * The component is designed to use ImageSelectionProvider to select images as well
 * @param serverRendered - server rendered data, should be rendered before the endless scroll i.e a list
 * of ImageListImage components
 * @param disableEditing - if true, the ImageListImage components will not be able to edit the image
 * @param withUpload - if true, the ImageUploader component will be rendered to make it possible to upload images to
 * the current collection (false by default)
 * @returns
 */
export default function ImageList({
    serverRendered,
    disableEditing,
    withUpload = false
}: PropTypes) {
    const context = useContext(ImagePagingContext)
    const { refresh } = useRouter()

    //This component must be rendered inside a ImagePagingContextProvider
    if (!context) throw new Error('No context')

    const handleUpload = useCallback(() => {
        refresh()
        context.refetch()
    }, [context, refresh])

    return (
        <div className={withUpload ?
            `${styles.ListImagesInCollection} ${styles.paddingTop}` :
            styles.ListImagesInCollection
        }>
            {
                withUpload && (
                    <PopUp PopUpKey={uuid()} showButtonClass={styles.uploadImage} showButtonContent={
                        <>Legg til bilde</>
                    }>
                        <ImageUploader
                            collectionId={context.deatils.collectionId}
                            successCallback={handleUpload}
                        />
                    </PopUp>
                )
            }
            {serverRendered} {/* Rendered on server homefully in the right way*/}
            <EndlessScroll
                pagingContext={ImagePagingContext}
                renderer={image => <ImageListImage key={image.id} image={image} disableEditing={disableEditing}/>}
            />
        </div>
    )
}
