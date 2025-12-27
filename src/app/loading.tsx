import styles from './loading.module.scss'
import { ServerSession } from '@/auth/session/ServerSession'
import Loader from '@/components/Loader/Loader'

export default async function loading() {
    const session = await ServerSession.fromNextAuth()

    return (
        <div className={styles.wrapper}>
            <Loader session={session} />
        </div>
    )
}
