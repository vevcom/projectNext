import styles from './Loader.module.scss'
import StandardImage from '@/components/Image/StandardImage'

function Loader() {
    return (
        <div className={styles.Loader}>
            <StandardImage
                standardImage="MAGISK_HATT"
                width={100}
            />
        </div>
    )
}

export default Loader
