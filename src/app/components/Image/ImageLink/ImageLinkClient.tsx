'use client'
import ImageLinkEditor from './ImageLinkEditor'
import styles from './ImageLink.module.scss'
import Image from '../Image'
import read from '@/actions/images/links/read'
import readImage from '@/actions/images/read'
import { useState, useEffect } from 'react'
import type { Image as ImageT, ImageLink } from '@prisma/client'
import type { PropTypes } from './ImageLink'

export default function ImageLinkClient({ name, width, alt, children, ...props }: PropTypes) {
    const [imageLink, setImageLink] = useState<
        ImageLink & {
            image: ImageT
        } | null>(null)
    useEffect(() => {
        read(name).then(({ success, data }) => {
            if (!success || !data) throw new Error('No image link found') //should not happen as the read action creates a link that does not exist
            const { image } = data
            if (!image) {
                return readImage('default_image').then(({ success: defaultSuccess, data: defaultImage }) => {
                    if (!defaultSuccess || !defaultImage) throw new Error('No default image found')
                    return setImageLink({ ...data, image: defaultImage })
                })
            }
            return setImageLink({ ...data, image })
        })
    }, [])

    return (
        <div className={styles.ImageLink}>
            {imageLink && <ImageLinkEditor imageLink={imageLink}/>}
            <div className={styles.children}>{children}</div>
            {imageLink?.image && <Image alt={alt} image={imageLink.image} width={width} {...props}/>}
        </div>
    )
}
