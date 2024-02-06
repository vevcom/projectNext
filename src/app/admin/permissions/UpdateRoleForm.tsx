'use client'

import { updateRole } from '@/actions/permissions'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import React, { useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/navigation'
import type { Prisma, Permission } from '@prisma/client'

type PermissionCategory = {
    title: string,
    permissions: {
        name: string,
        permission: Permission,
    }[],
}

// defines the layout of the role edit section
const permissionCategories: PermissionCategory[] = [
    {
        title: 'Hendelser',
        permissions: [
            { permission: 'CREATE_EVENTS', name: 'Lage hendelser' },
            { permission: 'PARTICIPATE_IN_EVENTS', name: 'Delta på hendelser' },
        ],
    },
    {
        title: 'Konto og pengebruk',
        permissions: [
            { permission: 'USE_MONEY', name: 'Bruk penger' },
            { permission: 'INFINITE_MONEY', name: 'Ubegrenset penger' },
        ],
    },
    {
        title: '«Bulshit» og «Omega Quotes»',
        permissions: [
            { permission: 'OMEGAQUOTES_READ', name: 'Lese omegaquotes' },
            { permission: 'OMEGAQUOTES_WRITE', name: 'Skrive omegaquotes' },
        ],
    },
    {
        title: 'Annet',
        permissions: [
            { permission: 'CREATIVE_MODE', name: 'Kreativ-modus' },
        ],
    },
]

type RoleWithPermissions = Prisma.RoleGetPayload<{include: { permissions: { select: { permission: true } } } } >

/**
 * This function returns all the permissions set to be displayed by
 * `permissionCategories` in the form of an object. The permission are the
 * keys and the values are if they should be checked by default. This is
 * determinded by if they are enabeld on the role that is passed in.
 */
function generateDisplayedPermissionsState(role: RoleWithPermissions) {
    return permissionCategories.reduce((result, category) => ({
        ...category.permissions.reduce((permissions, permission) => ({
            [permission.permission]: role.permissions.some(p => p.permission === permission.permission),
            ...permissions,
        }), {}),
        ...result,
    }), {})
}

type PropTypes = {
    selectedRole: RoleWithPermissions
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
        <Form submitText="Lagre" action={updateRole} successCallback={refresh}>
            <input type="hidden" name="id" value={selectedRole.id} />
            <TextInput label="Navn" name="name" value={nameField} onChange={e => setNameField(e.target.value) } />

            {permissionCategories.map(category => (
                category.permissions.map((entry, index) => (
                    <div key={uuid()}>
                        {index === 0 && <h3>{category.title}</h3>}
                        <label>
                            <input
                                type="checkbox"
                                name="permission"
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
