import styles from './ProgressBar.module.scss'
import type { CSSProperties } from 'react'

type PropTypes = {
    progress: number
}

/**
 *
 * @param progress - The progress of the progress bar from 0 to 1
 * @returns
 */
export default function ProgressBar({ progress }: PropTypes) {
    return (
        <div className={styles.ProgressBar}>
            <div className={styles.bar} style={{
                '--progress': progress
            } as CSSProperties}></div>
        </div>
    )
}
