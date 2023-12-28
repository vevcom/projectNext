import styles from './Loader.module.scss'
import ImageLink from '@/components/Image/ImageLink'

function Loader() {
    return (
        <div className={styles.Loader}>
            <ImageLink name="logo_simple" width={100} />
        </div>
    )
}

export default Loader
