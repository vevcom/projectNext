'use client'
import styles from './CmsImageEditor.module.scss'
import ChangeImage from './ChangeImage'
import EditOverlay from '@/cms/EditOverlay'
import PopUp from '@/components/PopUp/PopUp'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'
import CollectionCard from '@/components/Image/Collection/CollectionCard'
import ImageList from '@/components/Image/ImageList/ImageList'
import ImageCollectionPagingProvider, { ImageCollectionPagingContext } from '@/context/paging/ImageCollectionPaging'
import ImagePagingProvider from '@/context/paging/ImagePaging'
import PopUpProvider from '@/context/PopUp'
import ImageSelectionProvider from '@/context/ImageSelection'
import useEditing from '@/hooks/useEditing'
import { useState } from 'react'
import Link from 'next/link'
import type { CmsImage, Image as ImageT } from '@prisma/client'

type PropTypes = {
    cmsImage: CmsImage & {
        image: ImageT
    }
}

/**
 * A component to edit a cms image
 * @param cmsImage - the cms image to edit
 * @returns
 */
export default function CmsImageEditor({ cmsImage }: PropTypes) {
    const canEdit = useEditing()
    const [currentCollectionId, setCurrentCollectionId] = useState<number>(cmsImage.image.collectionId)

    const isCollectionActive = (collection: { id: number }) => (
        collection.id === currentCollectionId ? styles.selected : ''
    )

    return canEdit && (
        <PopUp
            PopUpKey={cmsImage.id}
            showButtonContent={<EditOverlay />}
            showButtonClass={styles.showBtn}
        >
            <ImageSelectionProvider defaultSelectionMode={true} defaultImage={cmsImage.image}>
                <ImagePagingProvider
                    startPage={
                        {
                            pageSize: 30,
                            page: 0,
                        }
                    }
                    details={{ collectionId: currentCollectionId }}
                    serverRenderedData={[]}
                >
                    <PopUpProvider>
                        <div className={styles.CmsImageEditor}>
                            <div className={styles.currentCmsImage}>
                                <div className={styles.info}>
                                    <h2>Edit image link</h2>
                                    <div className={styles.meta}>
                                        <p>name: {cmsImage.name}</p>
                                        <i>id: {cmsImage.id}</i>
                                    </div>
                                </div>
                                <ChangeImage
                                    currentImageSize={cmsImage.imageSize}
                                    currentImage={cmsImage.image}
                                    cmsImageId={cmsImage.id}
                                />
                            </div>
                            <div className={styles.selectImage}>
                                <ImageList disableEditing={true}/>
                            </div>
                            <div className={styles.selectCollection}>
                                <ImageCollectionPagingProvider
                                    startPage={{
                                        pageSize: 12,
                                        page: 0,
                                    }}
                                    details={undefined}
                                    serverRenderedData={[]}
                                >
                                    <EndlessScroll
                                        pagingContext={ImageCollectionPagingContext}
                                        renderer={collection => (
                                            <div
                                                key={collection.id}
                                                className={`${styles.collection} ${isCollectionActive(collection)}`}
                                            >
                                                <button
                                                    onClick={() => setCurrentCollectionId(collection.id)}
                                                    className={styles.selector}
                                                />
                                                <CollectionCard
                                                    className={styles.collectionCard}
                                                    collection={collection}
                                                />
                                            </div>
                                        )}
                                    />
                                </ImageCollectionPagingProvider>
                            </div>
                            <Link className={styles.linkToImages} href="/images/">
                                Go to images
                            </Link>
                        </div>
                    </PopUpProvider>
                </ImagePagingProvider>
            </ImageSelectionProvider>
        </PopUp>
    )
}
