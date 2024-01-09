import styles from './page.module.scss'
import CreateRoleForm from './CreateRoleForm'

import { getRoles } from '@/actions/permissions'

export default async function Permissions() {
    const roles = await getRoles()

    return (
        <div className={styles.permissionsWrapper}>
            <div>
                <h2>Permissions</h2>
                {roles.length > 0 ? roles.map(role => <p>{role.name}</p>) : <p>Ingen roller definert</p>}
            </div>

            <div>
                <CreateRoleForm />
            </div>
        </div>
    )
}