import styles from './page.module.scss'
import Link from 'next/link'

export default function Admin() {
    return (
        <div className={styles.wrapper}>
            <h2>Administrasjon</h2>
            <Link href="admin/phaestum">Phaestum</Link>
            <Link href="admin/cms">Edit cms</Link>
            <Link href="admin/users">Users</Link>
            <Link href="admin/permissions">Permissions</Link>
            <Link href="admin/groups">Grupper</Link>
            <Link href="admin/committees">Komitéer</Link>
        </div>
    )
}
