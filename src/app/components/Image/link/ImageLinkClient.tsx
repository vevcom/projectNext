'use client'
import { useState, useEffect } from 'react'
import type { Image as ImageT, ImageLink } from '@prisma/client'
import read from '@/actions/images/links/read'
import Image from '../Image'
import type { PropTypes } from './ImageLink'
import ImageLinkEditor from './ImageLinkEditor'
import styles from './ImageLink.module.scss'

export default function ImageLinkClient({ name, width, alt, children, ...props }: PropTypes) {
    const [imageLink, setImageLink] = useState<
        ImageLink & {
            image: ImageT | null
        } | null>(null)
    useEffect(() => {
        read(name).then(({ success, data }) => {
            if (success && data) return setImageLink(data)
            return read('default_image').then(({ success: defaultSuccess, data: defaultImage }) => {
                if (defaultSuccess && defaultImage) return setImageLink(defaultImage)
                throw new Error('No default image found. To fix add a image called: default_image')
            })
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
