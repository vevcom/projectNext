'use client'
import styles from './CmsImageEditor.module.scss'
import ChangeImage from './ChangeImage'
import PopUp from '../../PopUp/PopUp'
import EndlessScroll from '../../PagingWrappes/EndlessScroll'
import CollectionCard from '../../Image/Collection/CollectionCard'
import ImageList from '../../Image/ImageList/ImageList'
import { EditModeContext } from '@/context/EditMode'
import ImageCollectionPagingProvider, { ImageCollectionPagingContext } from '@/context/paging/ImageCollectionPaging'
import ImagePagingProvider from '@/context/paging/ImagePaging'
import PopUpProvider from '@/context/PopUp'
import ImageSelectionProvider from '@/context/ImageSelection'
import { useContext, useState } from 'react'
import { CmsImage, Image as ImageT } from '@prisma/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

type PropTypes = {
    imageLink: CmsImage & {
        image: ImageT
    }
}


export default function CmsImageEditor({ imageLink }: PropTypes) {
    const editingContext = useContext(EditModeContext)
    const [currentCollectionId, setCurrentCollectionId] = useState<number>(imageLink.image.collectionId)

    const isColectionActive = (collection: { id: number }) => (collection.id === currentCollectionId ? styles.selected : '')

    return (
        editingContext?.editMode && (
            <PopUp PopUpKey={imageLink.id} showButtonContent={
                <div className={styles.editIcon}>
                    <FontAwesomeIcon icon={faPencil} />
                </div>
            } showButtonClass={styles.openBtn}>
                <ImageSelectionProvider defaultSelectionMode={true} defaultImage={imageLink.image}>
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
                                <div className={styles.currentImageLink}>
                                    <h2>Edit image link</h2>
                                    <div className={styles.meta}>
                                        <p>name: {imageLink.name}</p>
                                        <i>id: {imageLink.id}</i>
                                    </div>
                                    <ChangeImage currentImage={imageLink.image} imageLinkId={imageLink.id}/>
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
                                        details={null}
                                        serverRenderedData={[]}
                                    >
                                        <EndlessScroll
                                            pagingContext={ImageCollectionPagingContext}
                                            renderer={collection => (
                                                <div key={collection.id} className={`${styles.collection} ${isColectionActive(collection)}`}>
                                                    <button onClick={() => setCurrentCollectionId(collection.id)} className={styles.selector}></button>
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
    )
}
