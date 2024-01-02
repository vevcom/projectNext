'use client'
import styles from './ImageCollectionList.module.scss'
import type { ImageCollection, Image } from '@prisma/client'
import PopUp from '@/app/components/PopUp/PopUp'
import ImageCollectionDisplay from '@/app/components/Image/ImageCollectionDisplay'
import Button from '@/app/components/UI/Button'
import { default as ImageComponent } from '@/components/Image/Image'
import { useEffect, useState, useCallback } from 'react'
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
    const [loading, setLoading] = useState(false)
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

    return (
        <div className={styles.ImageCollectionList}>
            {
                images.map(image =>
                    <div key={image.id} className={styles.imageAndBtn}>
                        <ImageComponent width={200} image={image} />
                        <PopUp showButtonContent={<></>}>
                            <ImageCollectionDisplay 
                                startImageName={image.name} 
                                collection={collection} 
                            />
                        </PopUp>
                    </div>
                )
            }
            <span className={styles.loadingControl}>
            {
                allLoaded ? (
                    <i>No more images to load</i>
                ) : 
                    <Button onClick={loadMoreImages}>Load more</Button>
            }
            </span>
        </div>
    )
}
