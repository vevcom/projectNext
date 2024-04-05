"use client"
import styles from './page.module.scss'
import Link from 'next/link'
import Button from '@/UI/Button'
import { createNotificationAction } from '@/actions/notifications/create'

export default function Notifications() {

    return (
        <div className={styles.wrapper}>
            <h2>Administrasjon av Varslinger</h2>
            <Link href="notifications/sendmail">Send mail</Link>
            <Link href="notifications/channels">Varlingskanaler</Link>
            <Link href="notifications/mailaliases">Mail aliaser</Link>
            <Button
                onClick={() => createNotificationAction()}
            >
                Klikk på meg for å sende et varsel
            </Button>
        </div>
    )
}
