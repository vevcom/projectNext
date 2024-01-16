import styles from './page.module.scss'
import CreateRoleForm from './CreateRoleForm'

import { getRoles } from '@/actions/permissions'
import DeleteRoleButton from './DeleteRoleButton'
import TextInput from '@/app/components/UI/TextInput'

export default async function Permissions() {
    const roles = await getRoles()
    
    const tableHeaders = [
        "Navn",
        "Bruke penger",
        "Bruke kioleskab",
        "Lage hendelser",
        "Kreativ-modus"
    ]

    const tableContents = Array.from(roles, role => { 
        return {
            name: role.name, 
            roleId: role.id,
            permissions: [
                role.useMoney,
                role.useFridge,
                role.createEvents,
                role.creativeMode
            ]
        }
    })

    return (
        <div className={styles.permissionsWrapper}>
            <div className={styles.permissionsDiv}>
            <h2>Permissions</h2>
            
            <table className={styles.permissionsTable}>
                <thead>
                    <tr>{tableHeaders.map(header => <th>{header}</th>)}</tr>
                </thead>
                <tbody>
                    {tableContents.map(({name, roleId, permissions}) => 
                        <tr>
                            <td><TextInput label="" defaultValue={name}/></td>
                            {permissions.map(allowed => <td><input type="checkbox" defaultChecked={allowed}></input></td>)}
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