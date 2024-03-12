'use client'

import Button from './components/UI/Button'
import styles from './error.module.scss'
import SpecialCmsImageClient from './components/Cms/CmsImage/SpecialCmsImageClient'

export default function ErrorBoundary({ error, reset }: {error: Error, reset: () => void}) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.info}>
                <div className={styles.imageContainer}>
                    <SpecialCmsImageClient special="SERVER_ERROR" width={60} />
                </div>
                <h3>500 - {error.message}</h3>
            </div>
            <Button onClick={reset}>Try again</Button>
        </div>
    )
}
