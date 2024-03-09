'use client'
import CmsImageEditor from './CmsImageEditor'
import styles from './CmsImage.module.scss'
import Image from '@/components/Image/Image'
import { readCmsImage } from '@/cms/images/read'
import { readImage } from '@/actions/images/read'
import { useState, useEffect } from 'react'
import type { PropTypes } from './CmsImage'
import type { Image as ImageT } from '@prisma/client'

export default function CmsImageClient({ cmsImage: givenCmsImage, children, ...props }: PropTypes) {
    const [cmsImage, setCmsImage] = useState<ImageT>(givenCmsImage)

    useEffect(() => {
        readCmsImage(name).then(res => {
            // No error should be thrown as the read action creates a link that does not exist
            if (!res.success) throw new Error('No image link found')

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
            {cmsImage?.image &&
                <Image
                    imageSize={cmsImage.imageSize}
                    image={cmsImage.image}
                    {...props}
                />
            }
        </div>
    )
}
