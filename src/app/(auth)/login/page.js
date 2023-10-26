import Input from '@/app/components/Input/Input'
import styles from './page.module.scss'
import magiskHatt from "@/images/magisk_hatt.png"
import Image from 'next/image'
import PrimaryButton from '@/app/components/PrimaryButton/PrimaryButton'
import CsrfToken from '../CsrfToken'

export default async function LogIn() {
  return (
    <div className={styles.wrapper}>
        <div className={styles.card}>
            <form className={styles.form} method="post" action="/api/auth/callback/credentials">
                <CsrfToken />
                <Input name="username" label="E-post"/>
                <Input name="password" label="Passord" type="password"/>

                <PrimaryButton text="Logg inn"></PrimaryButton>
            </form>
            <div className={styles.image}>
                <Image width={200} src={magiskHatt} />
            </div>
        </div>
    </div>
  )
}