'use client'
import styles from './ImageCollectionList.module.scss'
import type { ImageCollection, Image } from '@prisma/client'
import PopUp from '@/app/components/PopUp/PopUp'
import ImageCollectionDisplay from '@/app/components/Image/ImageCollectionDisplay'
import Button from '@/app/components/UI/Button'
import { default as ImageComponent } from '@/components/Image/Image'
import { 
    useEffect, 
    useState, 
    useMemo,
    useCallback, 
    Suspense,
} from 'react'
import { useInView } from 'react-intersection-observer'
import read from '@/actions/images/collections/read'
import { set } from 'zod'

type PropTypes = {
    collection: ImageCollection & {
        images: Image[],
    },
    pageSize: number,
}

//Note that this component may take iniitial images as props fetched on server
export default function ImageCollectionList({collection, pageSize}: PropTypes) {
    const [images, setImages] =  useState<Image[]>(collection.images)
    const [page, setPage] = useState(0)
    const [ref, inView] = useInView()
    const [allLoaded, setAllLoaded] = useState(false)

    const loadMoreImages = useCallback(async () => {
        const next = page + 1
        const {success, data, error} = await read(collection.id, pageSize, next)
        if (!(success && data)) return console.log(error)
        if (data.images.length === 0) return setAllLoaded(true)
        setImages(x => [...x, ...data.images])
        setPage(next)
    }, [page])

    useEffect(() => {
        if (inView) {
            loadMoreImages()
        }
    }, [inView])

    const imageComponents = useMemo(() => 
        images.map(image => 
        <ImageWithFallback 
            loadMoreImages={loadMoreImages} 
            allLoaded={allLoaded}
            key={image.id} 
            image={image} 
            collection={collection} 
        />),
    [images, collection])

    return (
        <div className={styles.ImageCollectionList}>
            {imageComponents}
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
    collection: ImageCollection & {
        images: Image[],
    },
    loadMoreImages: () => Promise<void>,
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