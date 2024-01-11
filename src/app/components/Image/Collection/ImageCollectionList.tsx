'use client'
import React from 'react'
import styles from './ImageCollectionList.module.scss'
import EndlessScroll from '../../PagingWrappes/EndlessScroll'
import { ImageCollectionPagingContext } from '@/context/paging/ImageCollectionPaging'
import CollectionCard from './CollectionCard'

type PropTypes = {
    serverRendered: React.ReactNode,
}

//Note that this component may take iniitial imagecollections as props fetched on server
export default function ImageCollectionList({ serverRendered }: PropTypes) {
    return (
        <div className={styles.ImageCollectionList}>
            {serverRendered} {/* Rendered on server homefully in the right way*/}
            <EndlessScroll pagingContext={ImageCollectionPagingContext} renderer={
                collection => <CollectionCard className={styles.collectionCard} key={collection.id} collection={collection}/>
            }/>
        </div>
    )
}
