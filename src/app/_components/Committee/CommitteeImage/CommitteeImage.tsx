import styles from './CommitteeImage.module.scss'
import CommitteeLogo from '@/components/Committee/CommitteeLogo/CommitteeLogo'
import CmsImage from '@/cms/CmsImage/CmsImage'
import { configureAction } from '@/services/configureAction'
import { updateCommitteeArticleCoverImageAction } from '@/services/groups/committees/actions'
import type { ReactNode } from 'react'
import type { ExpandedImage } from '@/services/images/subservice/types'
import type { ExpandedCmsImage } from '@/cms/images/types'
import type { AuthResultTypeAny } from '@/auth/authorizer/AuthResult'

type PropTypes = {
    children?: ReactNode
    logoImage: ExpandedImage
    coverImage: ExpandedCmsImage
    grayScale?: boolean,
    shortName: string
    canEditCoverImage: AuthResultTypeAny
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
    shortName,
    canEditCoverImage,
    grayScale = false
}: PropTypes) {
    return (
        <div className={styles.CommitteeImage}>
            <div className={styles.content}>
                {children}
            </div>
            <div className={styles.images}>
                <div className={styles.image}>
                    <CommitteeLogo
                        className={grayScale ? styles.gray : ''}
                        logoImage={logoImage}
                        width={350}
                    />
                </div>
                <CmsImage
                    canEdit={canEditCoverImage}
                    updateCmsImageAction={configureAction(
                        updateCommitteeArticleCoverImageAction,
                        { implementationParams: { shortName } }
                    )}
                    className={styles.committeeImage}
                    cmsImage={coverImage}
                    width={600}
                />
            </div>
        </div>
    )
}

