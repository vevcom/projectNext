'use client'
import styles from './StandardImage.module.scss'
import Image from './Image'
import useActionCall from '@/hooks/useActionCall'
import { readStandardImageAction } from '@/services/images/standard/actions'
import { useCallback } from 'react'
import type { PropTypes } from './StandardImage'

/**
 * WARNING: This component is only meant for the client - use StandardImage for the server
 * A component that fetches a standard image and displays it
 * @param standardImage - the standard image to display
 * @returns
 */
export default function StandardImageClient({ standardImage, children, className = '', ...props }: PropTypes) {
    const action = useCallback(
        () => readStandardImageAction({ params: { standardImage } }),
        [standardImage]
    )
    const { data: image, error } = useActionCall(action)
    if (error) throw new Error(`No standard image found for ${standardImage}`)

    return (
        image && (
            <div className={`${styles.StandardImage} ${className}`}>
                <Image image={image} {...props} />
                {children && <div className={styles.children}>{children}</div>}
            </div>
        )
    )
}
