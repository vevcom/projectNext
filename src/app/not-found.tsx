import styles from './not-found.module.scss'
import StandardImage from '@/components/Image/StandardImage'

export default function Error404() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.info}>
                <div className={styles.imageContainer}>
                    <StandardImage
                        standardImage="DEFAULT_IMAGE"
                        width={60}
                    />
                </div>
                <h3>404 - Page not found</h3>
            </div>
        </div>
    )
}
