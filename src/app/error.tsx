'use client'

import Button from './components/UI/Button'
import styles from './error.module.scss'
import ImageLink from './components/Image/ImageLink'

export default function ErrorBoundary({error, reset} : {error: Error, reset: () => void}) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.info}>
                <div className={styles.imageContainer}>
                    <ImageLink name="logo_simple" width={60} />
                </div>
                <h3>500 - {error.message}</h3>
            </div>
        </div>
    )
} 