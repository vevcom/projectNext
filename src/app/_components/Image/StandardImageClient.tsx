'use client'
import styles from './StandardImage.module.scss'
import Image from './Image'
import { useStandardImages } from '@/contexts/ClientData'
import type { PropTypes } from './StandardImage'

/**
 * WARNING: This component is only meant for the client - use StandardImage for the server
 * A component that displays a standard image, read from the ClientData cache (seeded by layout,
 * so no client fetch is needed).
 * @param standardImage - the standard image to display
 * @returns
 */
export default function StandardImageClient({ standardImage, children, className = '', ...props }: PropTypes) {
    const result = useStandardImages()
    if (result.status === 'loading') return null
    if (result.status === 'error') throw new Error(`No standard image found for ${standardImage}`)

    return (
        <div className={`${styles.StandardImage} ${className}`}>
            <Image image={result.standardImages[standardImage]} {...props} />
            {children && <div className={styles.children}>{children}</div>}
        </div>
    )
}
