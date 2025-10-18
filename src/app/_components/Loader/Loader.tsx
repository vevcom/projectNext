import { readSpecialCmsImageFrontpage, updateSpecialCmsImageFrontpage } from '@/services/frontpage/actions'
import styles from './Loader.module.scss'
import SpecialCmsImage from '@/components/Cms/CmsImage/SpecialCmsImage'

function Loader() {
    return (
        <div className={styles.Loader}>
            <SpecialCmsImage
                special="LOADER_IMAGE"
                width={100}
                //TODO: Probably call through other service see comments in frontpage operations
                readSpecialCmsImageAction={readSpecialCmsImageFrontpage}
                updateCmsImageAction={updateSpecialCmsImageFrontpage}
            />
        </div>
    )
}

export default Loader
