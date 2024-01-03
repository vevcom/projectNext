'use client'

import Button from './components/UI/Button'
import styles from './error.module.scss'
import Image from './components/Image/Image'

export default function ErrorBoundary({error, reset} : {error: Error, reset: () => void}) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.info}>
                <div className={styles.imageContainer}>
                </div>
                <h3>500 - {error.message}</h3>
            </div>
        </div>
    )
} 