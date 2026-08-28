import styles from './page.module.scss'
import CreateUserForm from '@/components/User/CreateUserForm'
import { userAuth } from '@/services/users/auth'
import { ServerSession } from '@/auth/session/ServerSession'

export default async function Users() {
    userAuth.create.dynamicFields({}).auth(
        await ServerSession.fromNextAuth()
    ).redirectOnUnauthorized({ returnUrl: '/admin/users' })

    return (
        <div className={styles.wrapper}>
            <CreateUserForm />
        </div>
    )
}
