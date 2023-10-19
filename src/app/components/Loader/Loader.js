import styles from './Loader.module.scss'
import logo from '@/images/logo_simple.png'
import Image from 'next/image'

function Loader() {
    return (
        <div className={styles.Loader}>
            <Image src={logo} />
        </div>
    )
}

export default Loader