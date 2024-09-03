'use client'

import styles from './error.module.scss'
import Button from '@/components/UI/Button'
import SpecialCmsImageClient from '@/components/Cms/CmsImage/SpecialCmsImageClient'

export default function ErrorBoundary({ error, reset }: {error: Error, reset: () => void}) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.info}>
                <div className={styles.imageContainer}>
                    <SpecialCmsImageClient width={70} special="SERVER_ERROR" />
                </div>
                <h3>500 - {error.message}</h3>
            </div>
            <Button onClick={reset}>Prøv igjen</Button>
        </div>
    )
}
