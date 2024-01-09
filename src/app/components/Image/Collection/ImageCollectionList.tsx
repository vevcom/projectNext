'use client'
import React from 'react'
import styles from './ImageCollectionList.module.scss'
import EndlessScroll from '../../PagingWrappes/EndlessScroll'
import { ImageCollectionPagingContext } from '@/context/paging/ImageCollectionPaging'

export default function ImageCollectionList() {
    return (
        <div className={styles.ImageCollectionList}>
            <EndlessScroll pagingContext={ImageCollectionPagingContext} renderer={
                collection => <>{collection.id}</>
            }/>
        </div>
    )
}
