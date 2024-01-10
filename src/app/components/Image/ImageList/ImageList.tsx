'use client'
import styles from './ImageList.module.scss'
import { useContext } from 'react'
import { ImagePagingContext } from '@/context/paging/ImagePaging'
import EndlessScroll from '@/components/PagingWrappes/EndlessScroll'
import ImageListImage from './ImageListImage'

type PropTypes = {
    serverRendered?: React.ReactNode,
    disableEditing?: boolean,
}

//Note that this component may take iniitial images as props fetched on server
export default function ImageList({ serverRendered, disableEditing } : PropTypes) {
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
