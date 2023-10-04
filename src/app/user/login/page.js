import styles from './page.module.scss'
import magiskHatt from "@/images/magisk_hatt.png"
import Image from 'next/image'

function LogIn() {
  return (
    <div className={styles.wrapper}>
        <div className={styles.card}>
            <form>
                log inn nå!!
            </form>
            <div className={styles.image}>
                <Image width={200 } src={magiskHatt} />
            </div>
        </div>
    </div>
  )
}

export default LogIn