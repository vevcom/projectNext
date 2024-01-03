'use client'
import styles from './ImageCollectionList.module.scss'
import type { ImageCollection, Image } from '@prisma/client'
import PopUp from '@/app/components/PopUp/PopUp'
import ImageCollectionDisplay from '@/app/components/Image/ImageCollectionDisplay'
import Button from '@/app/components/UI/Button'
import { default as ImageComponent } from '@/components/Image/Image'
import { 
    useEffect, 
    useContext,
    useMemo,
    useCallback, 
    Suspense,
} from 'react'
import { useInView } from 'react-intersection-observer'
import { ImageCollectionContext } from '@/context/paging/ImagePaging'


type PropTypes = {
    collection: ImageCollection,
}

//Note that this component may take iniitial images as props fetched on server
export default function ImageCollectionList({collection}: PropTypes) {
    const context = useContext(ImageCollectionContext)
    
    return (
        <div className={styles.ImageCollectionList}>
            {
                context?.state.data.map(image => 
                    <ImageWithFallback key={image.id} image={image} />)
            }
            <span className={styles.loadingControl}>
                <Suspense fallback={<div>Loading...</div>}>
                    {
                    context?.state.allLoaded ? (
                        <i>No more images to load</i>
                    ) : 
                        <div ref={null}>
                            <Button onClick={() => context?.loadMore({id: collection.id})}>Load more</Button>
                        </div>
                    }       
                </Suspense>
            </span>
        </div>
    )
}

function ImageWithFallback({ image }: { image: Image}) {
    return (
        <div className={styles.imageAndBtn}>
            <Suspense fallback={<div className={styles.skeleton}></div>}>
                <ImageComponent width={200} image={image} />
            </Suspense>
            <PopUp showButtonContent={<></>}>
                <ImageCollectionDisplay startImageName={image.name} />
            </PopUp>
        </div>
    )
}