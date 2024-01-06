import Loader from '@/components/Loader/Loader'
import styles from './loading.module.scss'

export default function loading() {
    return (
        <div className={styles.wrapper}>
            <Loader />
        </div>
    )
}
