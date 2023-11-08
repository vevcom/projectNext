import styles from './page.module.scss'
import Image from '@/components/Image/Image'
import PrimaryButton from '@/components/PrimaryButton/PrimaryButton'
import CsrfToken from '../CsrfToken'

export default async function LogOut() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <form className={styles.form} method="post" action="/api/auth/signout">
                    <CsrfToken />
                    <PrimaryButton text="Logg ut"></PrimaryButton>
                </form>
                <div className={styles.image}>
                    <Image name="magisk_hatt" width={200} />
                </div>
            </div>
        </div>
    )
}
