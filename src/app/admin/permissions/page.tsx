import styles from './page.module.scss'
import CreateRoleForm from './CreateRoleForm'

import { readRoles } from '@/actions/permissions'
import DeleteRoleButton from './DeleteRoleButton'
import TextInput from '@/app/components/UI/TextInput'
import { Permission } from '@prisma/client'

export default async function Permissions() {
    const {data: roles = []} = await readRoles()

    const permissionNames: Record<Permission, string> = {
        USE_MONEY: "Bruke penger",
        USE_FRIDGE: "Bruke kioleskab",
        INFINITE_MONEY: "Evig peneger",
        PARTICIPATE_IN_EVENTS: "Delta på hendelser",
        CREATE_EVENTS: "Lage hendelser",
        USE_OMEGA_QUOTES: "Skrive Omega Quotes",
        POST_BULSHIT: "Skrive bulshit",
        VIEW_BULSHIT: "Lese bulshit",
        CREATIVE_MODE: "Kreativ-modus",
    }

    const tableContents = roles.map(role => { 
        return {
            name: role.name, 
            roleId: role.id,
            permissions: role.permissions.map(permission => permission.permission)
        }
    })

    return (
        <div className={styles.permissionsWrapper}>
            <div className={styles.permissionsDiv}>
            <h2>Permissions</h2>
            
            <table className={styles.permissionsTable}>
                <thead>
                    <tr><th>Navn</th>{Object.values(permissionNames).map(header => <th>{header}</th>)}</tr>
                </thead>
                <tbody>
                    {tableContents.map(({name, roleId, permissions}) => 
                        <tr>
                            <td><TextInput label="" defaultValue={name}/></td>

                            {Object.keys(permissionNames).map(permission => 
                                <td><input type="checkbox" defaultChecked={permissions.includes(permission as Permission)} /></td>
                            )}
                            
                            <td><DeleteRoleButton roleId={roleId} /></td>
                        </tr>
                    )}
                </tbody>
            </table>
            </div>

            <div>
                <CreateRoleForm />
            </div>
        </div>
    )
}