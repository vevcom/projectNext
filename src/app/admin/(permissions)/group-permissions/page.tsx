import styles from './page.module.scss'
import { readPermissionMatrixAction } from '@/actions/permissions'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import Checkbox from '@/components/UI/Checkbox'
import { PermissionConfig } from '@/services/permissions/config'
import type { Permission } from '@prisma/client'

export default async function PermissionGroups() {
    const permissionMatrix = unwrapActionReturn(await readPermissionMatrixAction())

    const permissionList = Object.keys(PermissionConfig)

    return <div className={styles.wrapper}>
        <table className={styles.table}>
            <thead className={styles.tableHead}>
                <tr>
                    <th>Gruppe</th>
                    {permissionList.map((permission, i) =>
                        <th key={i} className={styles.permissionTH}>
                            <span>{PermissionConfig[permission as Permission].name}</span>
                        </th>
                    )}
                </tr>
            </thead>

            <tbody className={styles.tableBody}>
                {permissionMatrix.map((group, i) => (
                    <tr key={i}>
                        <td className={styles.groupName}>{group.name}</td>
                        {permissionList.map((permission, j) => {
                            const hasPermission = group.permissions.includes(permission as Permission)
                            return <td key={j} className={styles.permissionTD}>
                                <Checkbox name="abcd" defaultChecked={hasPermission} />
                            </td>
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}
