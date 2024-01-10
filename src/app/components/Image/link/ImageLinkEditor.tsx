'use client'
import { useContext, useState } from 'react'
import PopUp from '../../PopUp/PopUp'
import { EditModeContext } from '@/context/EditMode'
import styles from './ImageLinkEditor.module.scss'
import { ImageLink, Image as ImageT } from '@prisma/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import Image from '../Image'
import ImageCollectionPagingProvider, {ImageCollectionPagingContext} from '@/context/paging/ImageCollectionPaging'
import EndlessScroll from '../../PagingWrappes/EndlessScroll'
import CollectionCard from '../Collection/CollectionCard'
import ImagePagingProvider from '@/context/paging/ImagePaging'
import PopUpProvider from '@/context/PopUp'
import ImageList from '../ImageList/ImageList'
import ImageSelectionProvider from '@/context/ImageSelection'
import ChangeImage from './ChangeImage'

type PropTypes = {
    imageLink: ImageLink & {
        image: ImageT
    }
}


export default function ImageLinkEditor({ imageLink }: PropTypes) {
    const editingContext = useContext(EditModeContext)
    const [currentCollectionId, setCurrentCollectionId] = useState<number>(imageLink.image.collectionId)

    if (!editingContext?.editMode) return null
    return (
        <PopUp showButtonContent={
            <div className={styles.editIcon}>
                <FontAwesomeIcon icon={faPencil} />
            </div>
        } showButtonClass={styles.openBtn}>
            <ImageSelectionProvider defaultSelectionMode={true}>
                <ImagePagingProvider
                    startPage={
                        {
                            pageSize: 30,
                            page: 0,
                        }
                    }
                    details={{collectionId: currentCollectionId}}
                    serverRenderedData={[]}
                >
                    <PopUpProvider>
                        <div className={styles.ImageLinkEditor}>
                            <div className={styles.currentImageLink}>
                                <h2>Edit image link</h2>
                                <div className={styles.meta}>
                                    <p>name: {imageLink.name}</p>
                                    <i>id: {imageLink.id}</i>
                                </div>
                                <ChangeImage currentImage={imageLink.image} />
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
                                            <div key={collection.id} className={styles.collection}>
                                                <button onClick={() => setCurrentCollectionId(collection.id)} className={styles.selector}></button>
                                                <CollectionCard className={styles.collectionCard} collection={collection} />
                                            </div>
                                        )}
                                    />
                                </ImageCollectionPagingProvider>
                            </div>
                        </div>
                    </PopUpProvider>
                </ImagePagingProvider>
            </ImageSelectionProvider>
        </PopUp>
    )
}
