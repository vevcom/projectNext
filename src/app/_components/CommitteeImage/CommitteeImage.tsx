import styles from './CommitteeImage.module.scss'
import CmsImage from '@/cms/CmsImage/CmsImage'
import Image from '@/components/Image/Image'
import type { ReactNode } from 'react'
import type { Image as ImageT } from '@prisma/client'
import type { ExpandedCmsImage } from '@/cms/images/types'
import { configureAction } from '@/services/configureAction'
import { updateCommitteeCoverImageAction } from '@/services/groups/committees/actions'

type PropTypes = {
    children?: ReactNode
    logoImage: ImageT
    coverImage: ExpandedCmsImage
    grayScale?: boolean,
    shortname: string
}
/**
 * A component that renders a backdrop image with a content div on top of it
 * @param children - The content to render on top of the image
 * @param image - The image to render as a backdrop
 * @param grayScale - Whether the image should be rendered in grayscale (true by default)
 * */
export default function CommitteeImage({
    children,
    logoImage,
    coverImage,
    shortname,
    grayScale = false
}: PropTypes) {
    return (
        <div className={styles.CommitteeImage}>
            <div className={styles.content}>
                {children}
            </div>
            <div className={styles.images}>
                <div className={styles.image}>
                    <Image
                        className={grayScale ? styles.gray : ''}
                        image={logoImage}
                        width={350}
                    />
                </div>
                <CmsImage
                    updateCmsImageAction={configureAction(
                        updateCommitteeCoverImageAction,
                        { implementationParams: { shortname } }
                    )}
                    className={styles.committeeImage}
                    cmsImage={coverImage}
                    width={600}
                />
            </div>
        </div>
    )
}

