'use client'

import Button from './components/UI/Button'
import styles from './error.module.scss'
import ImageLinkClient from './components/Image/ImageLinkClient'

export default function ErrorBoundary({ error, reset } : {error: Error, reset: () => void}) {
    console.error(error) //Should be exchanged for logger when implemented
    return (
        <div className={styles.wrapper}>
            <div className={styles.info}>
                <div className={styles.imageContainer}>
                    <ImageLinkClient name="logo_simple" width={60} />
                </div>
                <h3>500 - {error.message}</h3>
            </div>
            <Button onClick={reset}>Try again</Button>
        </div>
    )
}
