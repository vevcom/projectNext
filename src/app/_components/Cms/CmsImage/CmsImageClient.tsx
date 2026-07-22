'use client'
import CmsImageEditor from './CmsImageEditor'
import styles from './CmsImage.module.scss'
import { fallbackImage } from './CmsImage'
import Image, { SrcImage } from '@/components/Image/Image'
import { useStandardImages } from '@/contexts/ClientData'
import type { PropTypes } from './CmsImage'

/**
 * WARNING: This component is only meant for the client
 * A function to display a cms image with image relation.
 * If the cms image does not have a image it uses the DEFAULT_IMAGE standard image (read from the
 * ClientData cache). If even that cannot be resolved it falls back to a static image.
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
    const standardImages = useStandardImages()
    const image = cmsImage.image
        ?? (standardImages.status === 'success' ? standardImages.standardImages.DEFAULT_IMAGE : null)

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
            {(!cmsImage.image && standardImages.status === 'error') && <SrcImage src={fallbackImage} {...props}/>}
        </div>
    )
}
