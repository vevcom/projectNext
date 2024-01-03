'use client'
import styles from './ImageCollectionList.module.scss'
import type { ImageCollection, Image } from '@prisma/client'
import PopUp from '@/app/components/PopUp/PopUp'
import ImageCollectionDisplay from '@/app/components/Image/Collection/ImageCollectionDisplay'
import { default as ImageComponent } from '@/components/Image/Image'
import {
    useEffect,
    useContext,
    useState,
    use,
    useCallback
} from 'react'
import { useInView } from 'react-intersection-observer'
import { ImagePagingContext } from '@/context/paging/ImagePaging'
import EndlessScroll from '../../PageingWrappes/EndlessScroll'
import { set } from 'zod'


type PropTypes = {
    collection: ImageCollection,
}

//Note that this component may take iniitial images as props fetched on server
export default function ImageCollectionList({ collection }: PropTypes) {
    const context = useContext(ImagePagingContext)

    //This component must be rendered inside a ImagePagingContextProvider
    if (!context) throw new Error('No context')
    const [ref, inView] = useInView({
        threshold: 0,
    })

    useEffect(() => {
        if (inView) {
            context?.loadMore({ id: collection.id })
        }
    }, [inView])

    return (
        <div className={styles.ImageCollectionList}>
            <EndlessScroll
                pageingContext={ImagePagingContext}
                details={{ id: collection.id }}
                renderer={image => <ImageWithFallback key={image.id} image={image} />}
            />
        </div>
    )
}

const ImageWithFallback = ({ image }: { image: Image}) => (
    <div className={styles.imageAndBtn}>
        <ImageComponent width={200} image={image} />
        <PopUp showButtonContent={<></>}>
            <ImageCollectionDisplay startImageName={image.name} />
        </PopUp>
    </div>
)
