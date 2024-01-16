import styles from './Loader.module.scss'
import CmsImage from '@/app/components/Cms/CmsImage/CmsImage'

function Loader() {
    return (
        <div className={styles.Loader}>
            <CmsImage name="logo_simple" width={100} />
        </div>
    )
}

export default Loader
