'use client'
import styles from './ImageList.module.scss'
import { useContext } from 'react'
import { ImagePagingContext } from '@/context/paging/ImagePaging'
import EndlessScroll from '@/components/PagingWrappes/EndlessScroll'

//Note that this component may take iniitial images as props fetched on server
export default function ImageList() {
    const context = useContext(ImagePagingContext)

    //This component must be rendered inside a ImagePagingContextProvider
    if (!context) throw new Error('No context')

    return (
        <div className={styles.ListImagesInCollection}>
            <EndlessScroll pagingContext={ImagePagingContext} />
        </div>
    )
}
