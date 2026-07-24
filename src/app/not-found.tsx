import styles from './not-found.module.scss'
import StandardImageServer from '@/components/Image/StandardImageServer'

export default function Error404() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.info}>
                <div className={styles.imageContainer}>
                    <StandardImageServer
                        standardImage="DEFAULT_IMAGE"
                        width={60}
                    />
                </div>
                <h3>404 - Page not found</h3>
            </div>
        </div>
    )
}
