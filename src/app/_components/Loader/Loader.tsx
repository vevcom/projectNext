import styles from './Loader.module.scss'
import StandardImageServer from '@/components/Image/StandardImageServer'

/**
 * WARNING: this component should only be rendered on the server
*/
function Loader() {
    return (
        <div className={styles.Loader}>
            <StandardImageServer
                standardImage="MAGISK_HATT"
                width={100}
            />
        </div>
    )
}

export default Loader
