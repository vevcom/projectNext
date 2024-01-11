import styles from './page.module.scss'
import CreateRoleForm from './CreateRoleForm'

import type { Role } from '@prisma/client'
import { getRoles } from '@/actions/permissions'

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
                <tr><th></th>{tableHeaders.map(header => <th>{header}</th>)}</tr>
                
                {tableContents.map(({name, permissions}) => 
                    <tr>
                        <td>X</td>
                        <td><input type="text" defaultValue={name}></input></td>
                        {permissions.map(allowed => <td><input type="checkbox" defaultChecked={allowed}></input></td>)}
                    
                    </tr>
                )}
            </table>
            </div>

            <div>
                <CreateRoleForm />
            </div>
        </div>
    )
}