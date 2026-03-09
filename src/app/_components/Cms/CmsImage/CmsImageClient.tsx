'use client'
import CmsImageEditor from './CmsImageEditor'
import styles from './CmsImage.module.scss'
import { fallbackImage } from './CmsImage'
import Image, { SrcImage } from '@/components/Image/Image'
import { readSpecialImageAction } from '@/services/images/actions'
import { useState, useEffect } from 'react'
import type { PropTypes } from './CmsImage'
import type { Image as ImageT } from '@/prisma-generated-pn-types'

/**
 * WARNING: This component is only meant for the client
 * A function to display a cms image with image relation.
 * If the cms image does not have a image it will use the default image
 * By calling on special image DEFAULT_IMAGE
 * @param cmsImage - the cms image to display with image relation
 * @param children - the children to display besides image
 * @returns
 */
export default function CmsImageClient({
    cmsImage,
    updateCmsImageAction,
    canEdit,
    children,
    className = '',
    classNameImage,
    disableEditor = false,
    ...props
}: PropTypes) {
    const [image, setCmsImage] = useState<ImageT | null>(cmsImage.image || null)
    const [fallback, setFallback] = useState(false)

    useEffect(() => {
        if (image) return
        readSpecialImageAction({ params: { special: 'DEFAULT_IMAGE' } }).then(res => {
            if (!res.success) return setFallback(true)
            return setCmsImage(res.data)
        })
    }, [readSpecialImageAction])

    return (
        <div className={`${styles.CmsImage} ${className}`}>
            {(image && !disableEditor) && <CmsImageEditor
                canEdit={canEdit}
                updateCmsImageAction={updateCmsImageAction}
                cmsImage={{ ...cmsImage, image }}
            />}
            <div className={styles.children}>{children}</div>
            {image &&
                <Image
                    className={classNameImage}
                    imageSize={cmsImage.imageSize}
                    image={image}
                    {...props}
                />
            }
            {fallback && <SrcImage src={fallbackImage} {...props}/>}
        </div>
    )
}
