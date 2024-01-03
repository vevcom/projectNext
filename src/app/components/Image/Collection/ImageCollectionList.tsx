'use client'
import styles from './ImageCollectionList.module.scss'
import type { ImageCollection, Image } from '@prisma/client'
import PopUp from '@/app/components/PopUp/PopUp'
import ImageCollectionDisplay from '@/app/components/Image/Collection/ImageCollectionDisplay'
import Button from '@/app/components/UI/Button'
import { default as ImageComponent } from '@/components/Image/Image'
import { 
    useEffect, 
    useContext,
    useMemo,
    Suspense,
} from 'react'
import { useInView } from 'react-intersection-observer'
import { ImagePagingContext } from '@/context/paging/ImagePaging'
import EndlessScroll from '../../PageingWrappes/EndlessScroll'


type PropTypes = {
    collection: ImageCollection,
}

//Note that this component may take iniitial images as props fetched on server
export default function ImageCollectionList({collection}: PropTypes) {
    const context = useContext(ImagePagingContext)

    //This component must be rendered inside a ImagePagingContextProvider
    if (!context) throw new Error('No context')
    const [ref, inView] = useInView({
        threshold: 0,
    })

    useEffect(() => {
        if (inView) {
            context?.loadMore({id: collection.id})
        }
    }, [inView])
    
    return (
        <div className={styles.ImageCollectionList}>
            <EndlessScroll 
                pageingContext={ImagePagingContext}
                details={{id: collection.id}}
                renderer={image => <ImageWithFallback image={image} />}
            />
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