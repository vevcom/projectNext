import styles from './not-found.module.scss'
import PageTitleSetter from '@/contexts/PageTitleSetter'
import StandardImageServer from '@/components/Image/StandardImageServer'

export default function Error404() {
    return (
        <div className={styles.wrapper}>
            <PageTitleSetter title={'Page not found'} />
            <div className={styles.info}>
                <div className={styles.imageContainer}>
                    <StandardImageServer
                        standardImage="LOGO_SIMPLE"
                        width={60}
                    />
                </div>
                <h3>404 - Page not found</h3>
            </div>
        </div>
    )
}
