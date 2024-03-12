import styles from './Loader.module.scss'
import SpecialCmsImage from '@/components/Cms/CmsImage/SpecialCmsImage'

function Loader() {
    return (
        <div className={styles.Loader}>
            <SpecialCmsImage special="LOADER_IMAGE" width={100} />
        </div>
    )
}

export default Loader
