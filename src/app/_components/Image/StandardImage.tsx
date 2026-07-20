import styles from './StandardImage.module.scss'
import Image from './Image'
import { readStandardImageAction } from '@/services/images/standard/actions'
import type { PropTypes as ImagePropTypes } from './Image'
import type { StandardImage as StandardImageT } from '@/prisma-generated-pn-types'
import type React from 'react'

export type PropTypes = Omit<ImagePropTypes, 'image' | 'imageSize' | 'smallSize' | 'largeSize'> & {
    standardImage: StandardImageT,
    children?: React.ReactNode,
}

/**
 * WARNING: This component is only meant for the server - use StandardImageClient for the client
 * A component that fetches a standard image and displays it. Unlike SpecialCmsImage, standard
 * images are resolved/generated from static config rather than being admin-editable, so this
 * component is read-only.
 * @param standardImage - the standard image to display
 * @returns
 */
export default async function StandardImage({ standardImage, children, className = '', ...props }: PropTypes) {
    const imageRes = await readStandardImageAction({ params: { standardImage } })
    if (!imageRes.success) throw new Error(`No standard image found for ${standardImage}`)
    const image = imageRes.data

    return (
        <div className={`${styles.StandardImage} ${className}`}>
            <Image image={image} {...props} />
            {children && <div className={styles.children}>{children}</div>}
        </div>
    )
}
