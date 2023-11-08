import styles from './Loader.module.scss'
import Image from '@/components/Image/Image'

function Loader() {
    return (
        <div className={styles.Loader}>
            <Image name="logo_simple" width={150} />
        </div>
    )
}

export default Loader
