'use client'

import { useContext } from 'react'
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

type PropTypes = {
    imageLink: ImageLink & {
        image: ImageT | null
    }
}


export default function ImageLinkEditor({ imageLink }: PropTypes) {
    const editingContext = useContext(EditModeContext)
    if (!editingContext?.editMode) return null

    return (
        <PopUp showButtonContent={
            <div className={styles.editIcon}>
                <FontAwesomeIcon icon={faPencil} />
            </div>
        } showButtonClass={styles.openBtn}>
            <div className={styles.ImageLinkEditor}>
                <div className={styles.currentImageLink}>
                    <h2>Edit image link</h2>
                    <div className={styles.meta}>
                        <p>name: {imageLink.name}</p>
                        <i>id: {imageLink.id}</i>
                    </div>
                    <div className={styles.currentImage}>
                    {
                        imageLink.image ? (
                        <>
                            <div>
                                <Image width={200} image={imageLink.image} />
                            </div>
                            <i>image name: {imageLink.image.name}</i>
                        </>
                        )
                            : <p>No image to this link yet</p>
                    }
                    </div>
                </div>
                <div className={styles.selectImage}>
                    <ImageCollectionPagingProvider
                        startPage={{
                            pageSize: 12,
                            page: 1,
                        }}
                        details={null}
                        serverRenderedData={[]}
                    >
                        <EndlessScroll 
                            pagingContext={ImageCollectionPagingContext}
                            renderer={collection => (
                                <CollectionCard key={collection.id} collection={collection} />
                            )}
                        />
                    </ImageCollectionPagingProvider>
                </div>
                <div className={styles.selectCollection}>
                    hola
                </div>
            </div>
        </PopUp>
    )
}
