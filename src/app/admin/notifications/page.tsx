
import styles from './page.module.scss'
import Link from 'next/link'

export default function Notifications() {

    return (
        <div className={styles.wrapper}>
            <h2>Administrasjon av Varslinger</h2>
            <Link href="notifications/sendmail">Send mail</Link>
            <Link href="notifications/channels">Varlingskanaler</Link>
        </div>
    )
}
