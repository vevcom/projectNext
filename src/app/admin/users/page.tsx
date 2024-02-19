import styles from './page.module.scss'
import CreateUserForm from '@/app/components/User/CreateUserForm'

export default function Users() {
    return (
        <div className={styles.wrapper}>
            <CreateUserForm />
        </div>
    )
}
