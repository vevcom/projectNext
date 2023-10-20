import { getCsrfToken } from "next-auth/react"

import styles from './page.module.scss'
import magiskHatt from "@/images/magisk_hatt.png"
import Image from 'next/image'
import PrimaryButton from '@/app/components/PrimaryButton/PrimaryButton'
import CsrfToken from '../CsrfToken'

export default async function LogOut() {
  const csrfToken = await getCsrfToken()

  return (
    <div className={styles.wrapper}>
        <div className={styles.card}>
            <form className={styles.form} method="post" action="/api/auth/signout">
                <CsrfToken />
                <PrimaryButton text="Logg ut"></PrimaryButton>
            </form>
            <div className={styles.image}>
                <Image width={200} src={magiskHatt} />
            </div>
        </div>
    </div>
  )
}