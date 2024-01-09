import React from 'react'
import CollectionCard from '@/components/Image/Collection/CollectionCard'
import styles from './ImageCollectionList.module.scss'
import type { ImageCollectionPageReturn } from '@/actions/images/collections/read'

type PropTypes = {
    collections: ImageCollectionPageReturn[]
}

export default function ImageCollectionList({ collections } : PropTypes) {
  return (
    <div className={styles.ImageCollectionList}>
        {
            collections.map(collection => (
                <CollectionCard collection={
                    {
                        ...collection
                    }
                } />
            ))
        }
    </div>
  )
}
