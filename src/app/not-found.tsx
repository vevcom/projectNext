import styles from './not-found.module.scss'
import SpecialCmsImage from '@/components/Cms/CmsImage/SpecialCmsImage'

export default function Error404() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.info}>
                <div className={styles.imageContainer}>
                    <SpecialCmsImage special="NOT_FOUND" width={60} />
                </div>
                <h3>404 - Page not found</h3>
            </div>
        </div>
    )
}
