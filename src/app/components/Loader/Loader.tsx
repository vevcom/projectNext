import styles from './Loader.module.scss'
import Image from '@/components/Image/Image'

function Loader() {
    return (
        <div className={styles.Loader}>
            <Image name="logo" width={350} />
        </div>
    )
}

export default Loader
