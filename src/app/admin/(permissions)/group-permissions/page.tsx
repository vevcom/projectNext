import styles from './page.module.scss'
import { readPermissionMatrixAction } from '@/actions/permissions'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { PermissionConfig } from '@/services/permissions/config'
import type { Permission } from '@prisma/client'
import PermissionCheckbox from './PermissionCheckbox'

export default async function PermissionGroups() {
    const permissionMatrix = unwrapActionReturn(await readPermissionMatrixAction())

    const permissionList = Object.keys(PermissionConfig)

    return <div className={styles.wrapper}>
        <table className={styles.table}>
            <thead className={styles.tableHead}>
                <tr>
                    <th>Gruppe</th>
                    {permissionList.map((permission, i) =>
                        <th
                            key={i}
                            className={styles.permissionTH}
                            title={PermissionConfig[permission as Permission].description}
                        >
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
                                <PermissionCheckbox
                                    groupId={group.id}
                                    permission={permission as Permission}
                                    value={hasPermission}
                                />
                            </td>
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}
