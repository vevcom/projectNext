import { updateDefaultPermissionsAction } from '@/actions/permissionRoles/update'
import Form from '@/app/components/Form/Form'
import { readDefaultPermissionsAction } from '@/actions/permissionRoles/read'
import PermissionCategory from '@/app/components/Permission/PermissionCategory'
import { permissionCategories } from '@/server/permissionRoles/ConfigVars'
import React from 'react'

export default async function Defaults() {
    const defaultPermissionsRes = await readDefaultPermissionsAction()

    if (!defaultPermissionsRes.success) {
        throw new Error(`Kunne ikke hente standard tillganger. ${defaultPermissionsRes.errorCode}`)
    }

    const defaultPermissions = defaultPermissionsRes.data

    return (
        <Form submitText="Lagre" action={updateDefaultPermissionsAction}>
            {
                permissionCategories.map(category =>
                    <PermissionCategory key={category} category={category} renderBesidePermission={
                        permission => (
                            <label>
                                <input
                                    type="checkbox"
                                    name="permissions"
                                    value={permission}
                                    defaultChecked={defaultPermissions.includes(permission)}
                                />
                            </label>
                        )
                    }
                    />
                )
            }
        </Form>
    )
}
