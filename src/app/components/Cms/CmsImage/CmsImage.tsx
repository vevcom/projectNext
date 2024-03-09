import CmsImageEditor from './CmsImageEditor'
import styles from './CmsImage.module.scss'
import Image from '@/components/Image/Image'
import { readSpecialImage } from '@/actions/images/read'
import React from 'react'
import type { ExpandedCmsImage } from '@/actions/cms/images/Types'
import type { PropTypes as ImagePropTypes } from '@/components/Image/Image'

export type PropTypes = Omit<ImagePropTypes, 'imageSize' | 'smallSize' | 'largeSize' | 'image' | 'children'> & {
    cmsImage: ExpandedCmsImage,
    children?: React.ReactNode
}

/**
 * A function to display a cms image with image relation. If the cms image does not have a image it will use the default image
 * By calling on special image DEFAULT_IMAGE
 * @param cmsImage - the cms image to display with image relation
 * @returns 
 */
export default async function CmsImage({ cmsImage, children, ...props }: PropTypes) {
    let image = cmsImage.image
    if (!image) {
        const defaultRes = await readSpecialImage('DEFAULT_IMAGE')
        if (!defaultRes.success) throw new Error('No default image found. To fix add a image called: default_image')
        image = defaultRes.data
    }

    return (
        <div className={styles.CmsImage}>
            <CmsImageEditor cmsImage={cmsImage}/>
            <Image imageSize={cmsImage.imageSize} image={image} {...props}/>
            <div className={styles.children}>{children}</div>
        </div>
    )
}
