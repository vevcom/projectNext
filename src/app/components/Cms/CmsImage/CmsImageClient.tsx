'use client'
import CmsImageEditor from './CmsImageEditor'
import styles from './CmsImage.module.scss'
import Image from '../../Image/Image'
import read from '@/actions/cms/images/read'
import readImage from '@/actions/images/read'
import { useState, useEffect } from 'react'
import type { Image as ImageT, CmsImage } from '@prisma/client'
import type { PropTypes } from './CmsImage'

export default function CmsImageClient({ name, width, alt, children, ...props }: PropTypes) {
    const [cmsImage, setCmsImage] = useState<
        CmsImage & {
            image: ImageT
        } | null>(null)
    useEffect(() => {
        read(name).then(res => {
            if (!res.success) throw new Error('No image link found') //should not happen as the read action creates a link that does not exist
            const { image } = res.data
            if (!image) {
                return readImage('default_image').then(defaultres => {
                    if (!defaultres.success) throw new Error('No default image found')
                    return setCmsImage({ ...res.data, image: defaultres.data })
                })
            }
            return setCmsImage({ ...res.data, image })
        })
    }, [])

    return (
        <div className={styles.CmsImage}>
            {cmsImage && <CmsImageEditor cmsImage={cmsImage}/>}
            <div className={styles.children}>{children}</div>
            {cmsImage?.image && <Image imageSize={cmsImage.imageSize} alt={alt} image={cmsImage.image} width={width} {...props}/>}
        </div>
    )
}
