import CmsImageEditor from './CmsImageEditor'
import styles from './CmsImage.module.scss'
import Image, { SrcImage } from '@/components/Image/Image'
import React from 'react'
import type { ExpandedCmsImage } from '@/cms/images/Types'
import type { PropTypes as ImagePropTypes } from '@/components/Image/Image'
import { readSpecialImageAction } from '@/actions/images/read'

export type PropTypes = Omit<
    ImagePropTypes, 'className' | 'imageSize' | 'smallSize' | 'largeSize' | 'image' | 'children'
> & {
    cmsImage: ExpandedCmsImage,
    children?: React.ReactNode
    className?: string
    classNameImage?: string
    disableEditor?: boolean
}

export const fallbackImage = '/images/fallback.jpg'

/**
 * WARNING: This component only works on the server
 * A function to display a cms image with image relation.
 * If the cms image does not have a image it will use the default image
 * By calling on special image DEFAULT_IMAGE
 * @param cmsImage - the cms image to display with image relation
 * @param children - the children to display besides image
 * @returns
 */
export default async function CmsImage({
    cmsImage,
    children,
    className = '',
    classNameImage,
    disableEditor = false,
    ...props
}: PropTypes) {
    let image = cmsImage.image
    if (!image) {
        const defaultRes = await readSpecialImageAction({ special: 'DEFAULT_IMAGE' })
        if (!defaultRes.success) return <SrcImage src={fallbackImage} {...props}/>
        image = defaultRes.data
    }

    return (
        <div className={`${styles.CmsImage} ${className}`}>
            {!disableEditor && <CmsImageEditor cmsImage={{ ...cmsImage, image }}/> }
            <Image className={classNameImage} imageSize={cmsImage.imageSize} image={image} {...props}/>
            <div className={styles.children}>{children}</div>
        </div>
    )
}
