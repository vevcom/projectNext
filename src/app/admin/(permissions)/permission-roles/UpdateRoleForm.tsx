'use client'

import { updateRoleAction } from '@/actions/permissionRoles/update'
import DisplayAllPermissions from '@/components/Permission/DisplayAllPermissions'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Permission } from '@prisma/client'
import type { ExpandedRole } from '@/services/permissionRoles/Types'

/**
 * This function returns all the permissions set to be displayed by
 * `permissionCategories` in the form of an object. The permission are the
 * keys and the values are if they should be checked by default. This is
 * determinded by if they are enabeld on the role that is passed in.
 */
function generateDisplayedPermissionsState(role: ExpandedRole) {
    return Object.values(Permission).reduce((result, permission) => ({
        [permission]: role.permissions.some(p => p.permission === permission),
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
            <DisplayAllPermissions renderBesidePermission={permission => (
                <label>
                    <input
                        type="checkbox"
                        name="permissions"
                        value={permission}
                        checked={checkedPermissions[permission]}
                        onChange={e =>
                            setCheckedPermissions({ ...checkedPermissions, [permission]: e.target.checked })
                        }
                    />
                </label>
            )}
            />
        </Form>
    )
}
