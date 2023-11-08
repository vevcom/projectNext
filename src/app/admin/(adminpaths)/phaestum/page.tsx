import styles from './page.module.scss'
import Link from 'next/link'

export default function Phaesumcd() {
    return (
        <div className={styles.wrapper}>
            <h3>Phaestum</h3>
            <Link href="/admin/phaestum/countdown">Countdown</Link>
            <Link href="/admin/phaestum/memberregistration">Register new members</Link>
        </div>
    )
}