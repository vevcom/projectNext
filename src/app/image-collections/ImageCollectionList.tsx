'use client'
import styles from './ImageCollectionList.module.scss'
import CollectionCard from '@/components/Image/Collection/CollectionCard'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'
import { DynamicImageCollectionPagingContext } from '@/contexts/paging/DynamicImageCollectionPaging'
import { useState, type ReactNode } from 'react'
import { useSpecialCollections } from '@/contexts/ClientData'

type PropTypes = {
    serverRendered: ReactNode,
}

/**
 * WARNING: The server rendered data should be CollectioCards to make it consistent with the endless scroll
 * @param serverRendered - Make sure to pass the server rendered collections here in the correct format
 * @returns
 */
export default function ImageCollectionList({ serverRendered }: PropTypes) {
    const [mode, setMode] = useState<'special' | 'dynamic'>('dynamic')

    const specialCollectionsData = useSpecialCollections()

    return (
        <div className={styles.ImageCollectionList}>
            {serverRendered} {/* Rendered on server (page.tsx) hopefully in the right way*/}
            <EndlessScroll
                pagingContext={DynamicImageCollectionPagingContext}
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
