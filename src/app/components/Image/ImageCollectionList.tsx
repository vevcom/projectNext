'use cleint'
import styles from './ImageCollectionList.module.scss'
import type { ImageCollection, Image } from '@prisma/client'
import PopUp from '@/app/components/PopUp/PopUp'
import ImageCollectionDisplay from '@/app/components/Image/ImageCollectionDisplay'
import Button from '@/app/components/UI/Button'
import { default as ImageComponent } from '@/components/Image/Image'
import { useState } from 'react'
import { useInView } from 'react-intersection-observer'

type PropTypes = {
    collection: ImageCollection & {
        images: Image[],
    }
}

//Note that this component may take iniitial images as props fetched on server
export default function ImageCollectionList({collection}: PropTypes) {
    const [images, setImages] =  useState<Image[]>(collection.images)
    const [page, setPage] = useState(0)
    const [ref, inView] = useInView()

    return (
        <div className={styles.ImageCollectionList}>
            {
                collection.images.map(image =>
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
        </div>
    )
}
