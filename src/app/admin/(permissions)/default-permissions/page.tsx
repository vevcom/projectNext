import { updateDefaultPermissionsAction } from '@/actions/permissionRoles/update'
import Form from '@/components/Form/Form'
import { readDefaultPermissionsAction } from '@/actions/permissionRoles/read'
import { permissionCategories } from '@/app/admin/(permissions)/ConfigVars'
import React from 'react'
import { v4 as uuid } from 'uuid'

export default async function Defaults() {
    const defaultPermissionsRes = await readDefaultPermissionsAction()

    if (!defaultPermissionsRes.success) {
        throw new Error(`Kunne ikke hente standard tillganger. ${defaultPermissionsRes.errorCode}`)
    }

    const defaultPermissions = defaultPermissionsRes.data

    return (
        <Form submitText="Lagre" action={updateDefaultPermissionsAction}>
            {permissionCategories.map(category => (
                category.permissions.map((entry, index) => (
                    <div key={uuid()}>
                        {index === 0 && <h3>{category.title}</h3>}
                        <label>
                            <input
                                type="checkbox"
                                name="permissions"
                                value={entry.permission}
                                defaultChecked={defaultPermissions.includes(entry.permission)}
                            />
                            {entry.name}
                        </label>
                    </div>
                ))
            ))}
        </Form>
    )
}
