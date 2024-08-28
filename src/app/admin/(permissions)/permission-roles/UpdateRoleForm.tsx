'use client'

import { updateRoleAction } from '@/actions/permissionRoles/update'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import { permissionCategories } from '@/app/admin/(permissions)/ConfigVars'
import React, { useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/navigation'
import type { ExpandedRole } from '@/services/permissionRoles/Types'
import type { Permission } from '@prisma/client'

/**
 * This function returns all the permissions set to be displayed by
 * `permissionCategories` in the form of an object. The permission are the
 * keys and the values are if they should be checked by default. This is
 * determinded by if they are enabeld on the role that is passed in.
 */
function generateDisplayedPermissionsState(role: ExpandedRole) {
    return permissionCategories.reduce((result, category) => ({
        ...category.permissions.reduce((permissions, permission) => ({
            [permission.permission]: role.permissions.some(p => p.permission === permission.permission),
            ...permissions,
        }), {}),
        ...result,
    }), {})
}

type PropTypes = {
    selectedRole: ExpandedRole
}

export function UpdateRoleForm({ selectedRole }: PropTypes) {
    const { refresh } = useRouter()

    const [nameField, setNameField] = useState<string>(selectedRole.name)
    const [checkedPermissions, setCheckedPermissions] = useState<{ [key in Permission]?: boolean }>(
        generateDisplayedPermissionsState(selectedRole)
    )

    useEffect(() => {
        setNameField(selectedRole.name)

        setCheckedPermissions(generateDisplayedPermissionsState(selectedRole))
    }, [selectedRole])

    return (
        <Form submitText="Lagre" action={updateRoleAction} successCallback={refresh}>
            <input type="hidden" name="id" value={selectedRole.id} />
            <TextInput label="Navn" name="name" value={nameField} onChange={e => setNameField(e.target.value) } />

            {permissionCategories.map(category => (
                category.permissions.map((entry, index) => (
                    <div key={uuid()}>
                        {index === 0 && <h3>{category.title}</h3>}
                        <label>
                            <input
                                type="checkbox"
                                name="permissions"
                                value={entry.permission}
                                checked={checkedPermissions[entry.permission]}
                                onChange={e =>
                                    setCheckedPermissions({ ...checkedPermissions, [entry.permission]: e.target.checked }
                                    )}
                            />
                            {entry.name}
                        </label>
                    </div>
                ))
            ))}
        </Form>
    )
}
