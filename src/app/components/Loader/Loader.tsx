import styles from './Loader.module.scss'
import ImageLink from '@/app/components/Cms/CmsImage/CmsImage'

function Loader() {
    return (
        <div className={styles.Loader}>
            <ImageLink name="logo_simple" width={100} />
        </div>
    )
}

export default Loader
