'use client'
import React from 'react'
import styles from './ImageCollectionList.module.scss'
import EndlessScroll from '../../PagingWrappes/EndlessScroll'
import { ImageCollectionPagingContext } from '@/context/paging/ImageCollectionPaging'
import CollectionCard from './CollectionCard'

export default function ImageCollectionList() {
    return (
        <div className={styles.ImageCollectionList}>
            <EndlessScroll pagingContext={ImageCollectionPagingContext} renderer={
                collection => <CollectionCard className={styles.collectionCard} key={collection.id} collection={collection}/>
            }/>
        </div>
    )
}
