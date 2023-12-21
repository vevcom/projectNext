import Image from '@/components/Image/Image'
import styles from './not-found.module.scss'

export default function Error404() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.info}>
                <div className={styles.imageContainer}>
                    <Image name="logo_simple" width={60} />
                </div>
                <h3>404 - Page not found</h3>
            </div>
        </div>
    )
}
