'use client'
import styles from './error.module.scss'
import Button from '@/components/UI/Button'
import SpecialCmsImageClient from '@/components/Cms/CmsImage/SpecialCmsImageClient'
import { readSpecialCmsImageFrontpage, updateSpecialCmsImageFrontpage } from '@/services/frontpage/actions'

/**
 * note that passing custom error type to next error boundary is not supported
 * thus the error is encoded in a normal Error object
 * Look at redirectToErrorPage to how it is implemented.
*/
export default function ErrorBoundary({ error, reset }: {error: unknown, reset: () => void}) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.info}>
                <div className={styles.imageContainer}>
                    <SpecialCmsImageClient
                        width={70}
                        special="SERVER_ERROR"
                        readSpecialCmsImageAction={readSpecialCmsImageFrontpage}
                        updateCmsImageAction={updateSpecialCmsImageFrontpage}
                    />
                </div>
                {
                    error instanceof Error ? (
                        <h3>{error.message}</h3>
                    ) : (
                        <h3>Ukjent feil</h3>
                    )
                }
            </div>
            <Button onClick={reset}>Prøv igjen</Button>
        </div>
    )
}
