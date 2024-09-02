'use client'
import styles from './ImageCollectionList.module.scss'
import CollectionCard from './CollectionCard'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'
import { ImageCollectionPagingContext } from '@/contexts/paging/ImageCollectionPaging'
import React from 'react'

type PropTypes = {
    serverRendered: React.ReactNode,
}

// Note that this component may take iniitial imagecollections as props fetched on server
/**
 * WARNING: The server rendered data should be CollectioCards to make it consistent with the endless scroll
 * @param serverRendered - Make sure to pass the server rendered collections here in the correct format
 * @returns
 */
export default function ImageCollectionList({ serverRendered }: PropTypes) {
    return (
        <div className={styles.ImageCollectionList}>
            {serverRendered} {/* Rendered on server homefully in the right way*/}
            <EndlessScroll
                pagingContext={ImageCollectionPagingContext}
                renderer={
                    (collection, i) => (
                        <CollectionCard
                            className={styles.collectionCard}
                            key={i}
                            collection={collection}
                        />
                    )
                }
            />
        </div>
    )
}
