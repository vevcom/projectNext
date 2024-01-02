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

type ColletionWithImage = ImageCollection & {
    images: Image[],
}

type PropTypes = {
    collection: ColletionWithImage
    pageSize: number,
}

//Note that this component may take iniitial images as props fetched on server
export default function ImageCollectionList({collection: initial, pageSize}: PropTypes) {

    return (
        <div className={styles.ImageCollectionList}>
            {
                collection.images.map(image => 
                    <ImageWithFallback 
                        loadMoreImages={loadMoreImages} 
                        allLoaded={allLoaded}
                        key={image.id} 
                        image={image} 
                        collection={collection} 
                    />)
            }
            <span className={styles.loadingControl}>
                <Suspense fallback={<div>Loading...</div>}>
                    {
                    allLoaded ? (
                        <i>No more images to load</i>
                    ) : 
                        <div ref={ref}>
                            <Button onClick={loadMoreImages}>Load more</Button>
                        </div>
                    }       
                </Suspense>
            </span>
        </div>
    )
}

function ImageWithFallback({ 
    image, 
    collection,
    loadMoreImages,
    allLoaded,
}: { 
    image: Image, 
    collection: ColletionWithImage,
    loadMoreImages: () => Promise<ColletionWithImage | null>,
    allLoaded: boolean,
}) {
    return (
        <div className={styles.imageAndBtn}>
            <Suspense fallback={<div className={styles.skeleton}></div>}>
                <ImageComponent width={200} image={image} />
            </Suspense>
            <PopUp showButtonContent={<></>}>
                <ImageCollectionDisplay 
                    startImageName={image.name} 
                    collection={collection} 
                    loadMoreImages={loadMoreImages}
                    allLoaded={allLoaded}
                />
            </PopUp>
        </div>
    )
}