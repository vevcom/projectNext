'use client'
import CmsImageEditor from './CmsImageEditor'
import styles from './CmsImage.module.scss'
import Image from '@/components/Image/Image'
import { readSpecialImage } from '@/actions/images/read'
import { useState, useEffect } from 'react'
import type { PropTypes } from './CmsImage'
import type { Image as ImageT } from '@prisma/client'

/**
 * WARNING: This component is only meant for the client
 * A function to display a cms image with image relation. If the cms image does not have a image it will use the default image
 * By calling on special image DEFAULT_IMAGE
 * @param cmsImage - the cms image to display with image relation
 * @param children - the children to display besides image
 * @returns 
 */
export default function CmsImageClient({ cmsImage, children, ...props }: PropTypes) {
    const [image, setCmsImage] = useState<ImageT | null>(cmsImage.image || null)

    useEffect(() => {
        if (image) return
        readSpecialImage('DEFAULT_IMAGE').then(res => {
            if (!res.success) throw new Error('No default image found. To fix add a image called: default_image')
            setCmsImage(res.data)
        })
    }, [])

    return (
        <div className={styles.CmsImage}>
            {image && <CmsImageEditor cmsImage={{...cmsImage, image}}/>}
            <div className={styles.children}>{children}</div>
            {image &&
                <Image
                    imageSize={cmsImage.imageSize}
                    image={image}
                    {...props}
                />
            }
        </div>
    )
}
