"use client"

import styles from './page.module.scss'
import Link from 'next/link'
import { sendDevMail } from '@/actions/dev'
import Button from '@/components/UI/Button'

export default function Admin() {
    return (
        <div className={styles.wrapper}>
            <h2>Administrasjon</h2>
            <Link href="admin/phaestum">Phaestum</Link>
            <Link href="admin/cms">Edit cms</Link>
            <Link href="admin/users">Users</Link>
            <Link href="admin/permissions">Permissions</Link>

            <Button onClick={sendDevMail}>Click me</Button>
        </div>
    )
}
