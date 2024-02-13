import styles from './Loader.module.scss'
import CmsImage from '@/components/Cms/CmsImage/CmsImage'

function Loader() {
    return (
        <div className={styles.Loader}>
            <CmsImage name="loader_image" width={100} />
        </div>
    )
}

export default Loader
