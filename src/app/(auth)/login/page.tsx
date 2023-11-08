import FormInput from '@/components/FormInput/FormInput'
import styles from './page.module.scss'
import Image from '@/components/Image/Image'
import PrimaryButton from '@/components/PrimaryButton/PrimaryButton'
import CsrfToken from '../CsrfToken'

export default async function LogIn() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <form className={styles.form} method="post" action="/api/auth/callback/credentials">
                    <CsrfToken />
                    <FormInput name="username" label="E-post"/>
                    <FormInput name="password" label="Passord" type="password"/>

                    <PrimaryButton text="Logg inn"></PrimaryButton>
                </form>
                <div className={styles.image}>
                    <Image name="magisk_hatt" width={200} />
                </div>
            </div>
        </div>
    )
}
