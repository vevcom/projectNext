import styles from './not-found.module.scss'
import CmsImage from '@/app/components/Cms/CmsImage/CmsImage'

export default function Error404() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.info}>
                <div className={styles.imageContainer}>
                    <CmsImage name="not-found" width={60} />
                </div>
                <h3>404 - Page not found</h3>
            </div>
        </div>
    )
}
