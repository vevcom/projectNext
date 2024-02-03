'use client'

import { updateRole } from '@/actions/permissions'
import Form from '@/app/components/Form/Form'
import TextInput from '@/app/components/UI/TextInput'
import React, { useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import type { Prisma, Permission } from '@prisma/client'

type RoleSettingsCategory = {
    title: string,
    permissions: Array<{
        name: string,
        permission: Permission,
    }>,
}

// defines the layout of the role edit section
const roleSettingsCategories: Array<RoleSettingsCategory> = [
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
            { permission: 'POST_BULSHIT', name: 'Legge ut «Bulshit»-er' },
            { permission: 'VIEW_BULSHIT', name: 'Lese «Bulshit»-er' },
            { permission: 'USE_OMEGA_QUOTES', name: 'Lese og legge ut sitater på «Omega Quotes»' },
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

type PropTypes = {
    selectedRole: RoleWithPermissions
    refreshRoles: () => void
}

export function UpdateRoleForm({ selectedRole, refreshRoles }: PropTypes) {
    const [nameField, setNameField] = useState<string>(selectedRole.name)

    useEffect(() => {
        setNameField(selectedRole.name)
    }, [selectedRole])

    return (
        <Form submitText="Lagre" action={updateRole} successCallback={refreshRoles}>
            <input type="hidden" name="id" value={selectedRole.id} />
            <TextInput label="Navn" name="name" value={nameField} onChange={e => setNameField(e.target.value) } />

            {roleSettingsCategories.map(category => (
                category.permissions.map((entry, index) => (
                    <div key={uuid()}>
                        {index === 0 && <h3>{category.title}</h3>}
                        <label>
                            <input
                                type="checkbox"
                                name="permission"
                                value={entry.permission}
                                defaultChecked={selectedRole.permissions.some(
                                    permission => permission.permission === entry.permission
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
