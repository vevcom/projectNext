'use client'
import styles from './CmsImageEditor.module.scss'
import ChangeImage from './ChangeImage'
import ChangeImageForm from './ChangeImageForm'
import EditOverlay from '@/cms/EditOverlay'
import PopUp from '@/components/PopUp/PopUp'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'
import CollectionCard from '@/components/Image/Collection/CollectionCard'
import ImageList from '@/components/Image/ImageList/ImageList'
import {
    DynamicImageCollectionPagingProvider,
    DynamicImageCollectionPagingContext
} from '@/contexts/paging/DynamicImageCollectionPaging'
import useEditMode from '@/hooks/useEditMode'
import { ImagePagingProvider } from '@/contexts/paging/ImagePaging'
import PopUpProvider from '@/contexts/PopUp'
import ImageSelectionProvider from '@/contexts/ImageSelection'
import { useSpecialCollections } from '@/contexts/ClientData'
import { useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo } from '@fortawesome/free-solid-svg-icons'
import type { ExpandedImageCollection } from '@/services/images/subservice/types'
import type { CmsImage, Image as ImageT } from '@/prisma-generated-pn-types'
import type { UpdateCmsImageAction } from '@/cms/images/types'
import type { AuthResultTypeAny } from '@/auth/authorizer/AuthResult'

const collectionPagingDetails = { showOnlyCollectionsSessionAdministrates: true } as const

type PropTypes = {
    cmsImage: CmsImage & {
        image: ImageT | null
    },
    updateCmsImageAction: UpdateCmsImageAction
    canEdit: AuthResultTypeAny
}

/**
 * A component to edit a cms image. If cmsImage.image is null the user is choosing an image for
 * the slot for the first time - no collection is pre-selected until they pick one.
 * @param cmsImage - the cms image to edit
 * @returns
 */
export default function CmsImageEditor({ cmsImage, updateCmsImageAction, canEdit }: PropTypes) {
    const editable = useEditMode({ authResult: canEdit })
    const [currentCollectionId, setCurrentCollectionId] = useState<number | null>(
        cmsImage.image?.collectionId ?? null
    )

    const specialCollectionsResult = useSpecialCollections()

    const isCollectionActive = (collection: { id: number }) => (
        collection.id === currentCollectionId ? styles.selected : ''
    )

    const renderCollection = (collection: ExpandedImageCollection) => (
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
    )

    const renderSpecialCollections = () => {
        if (specialCollectionsResult.status === 'loading') return <i>Laster inn...</i>
        if (specialCollectionsResult.status === 'error') return <p>Noe gikk galt</p>
        return specialCollectionsResult.specialCollections.map(renderCollection)
    }

    if (!editable) return null
    return (
        <PopUp
            popUpKey={`EditCmsImage${cmsImage.id}`}
            showButtonContent={<EditOverlay />}
            showButtonClass={styles.showBtn}
        >
            <ImageSelectionProvider defaultSelectionMode={true} defaultImage={cmsImage.image ?? undefined}>
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
                                    updateCmsImageAction={updateCmsImageAction}
                                />
                            </div>
                            <ChangeImageForm
                                className={styles.changeImageMobile}
                                cmsImageId={cmsImage.id}
                                updateCmsImageAction={updateCmsImageAction}
                            />
                            <div className={styles.selectImage}>
                                <ImageList/>
                            </div>
                            <div className={styles.selectCollection}>
                                <p className={styles.collectionNote}>
                                    <FontAwesomeIcon icon={faInfo} />
                                    <span>
                                        Du ser bare bildesamlingene du administrerer. Merk at bildet du
                                        velger blir synlig for alle som kan se siden det brukes på - også
                                        for de som ikke har tilgang til samlingen bildet ligger i.
                                    </span>
                                </p>
                                <div className={styles.collections}>
                                    {renderSpecialCollections()}
                                    <DynamicImageCollectionPagingProvider
                                        startPage={{
                                            pageSize: 12,
                                            page: 0,
                                        }}
                                        details={collectionPagingDetails}
                                        serverRenderedData={[]}
                                    >
                                        <EndlessScroll
                                            pagingContext={DynamicImageCollectionPagingContext}
                                            renderer={renderCollection}
                                        />
                                    </DynamicImageCollectionPagingProvider>
                                </div>
                            </div>
                            <Link className={styles.linkToImages} href="/image-collections/">
                                Go to images
                            </Link>
                        </div>
                    </PopUpProvider>
                </ImagePagingProvider>
            </ImageSelectionProvider>
        </PopUp>
    )
}
