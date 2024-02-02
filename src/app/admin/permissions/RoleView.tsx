'use client'

import styles from './page.module.scss'
import CreateRoleForm from './CreateRoleForm'
import { updateRole } from '@/actions/permissions'
import Form from '@/app/components/Form/Form'
import TextInput from '@/app/components/UI/TextInput'
import React, { useState } from 'react'
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
    roles: Array<RoleWithPermissions>
}

export default function RoleView({ roles }: PropTypes) {
    const [selectedRole, setSelectedRole] = useState<RoleWithPermissions | undefined>()

    function onRoleSelectChange(e: React.ChangeEvent<HTMLInputElement>) {
        const id = Number(e.target.value)

        setSelectedRole(roles.find(role => role.id === id))
    }

    function onPermissionChange(e: React.ChangeEvent<HTMLInputElement>, targetPermission: Permission) {
        if (!selectedRole) return

        const permissions = e.target.checked ?
            selectedRole.permissions.concat({ permission: targetPermission }) :
            selectedRole.permissions.filter(permission => permission.permission !== targetPermission)

        setSelectedRole({
            ...selectedRole,
            permissions
        })
    }

    return (
        <div className={styles.permissionsWrapper}>
            <div className={styles.roleTable}>
                <table>
                    <thead>
                        <tr>
                            <th>Navn</th><th>Gjelder for</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map(role =>
                            <tr key={uuid()}>
                                <td className={styles.roleSelect}>
                                    <input
                                        type="radio"
                                        value={role.id}
                                        id={`role${role.id}`}
                                        name="roleSelect"
                                        checked={role.id === selectedRole?.id}
                                        onChange={onRoleSelectChange}
                                    />
                                    <label htmlFor={`role${role.id}`}>{role.name}</label>
                                </td>
                                <td>
                                    Vevcom, Testcom, Lolcom
                                </td>
                            </tr>
                        )}

                        <tr>
                            <td>
                                <CreateRoleForm />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className={styles.permissionsSettings}>
                <h2>Innstillinger</h2>
                {selectedRole ?
                    <Form action={updateRole} submitText="Lagre">
                        <TextInput label="Navn" name="name" defaultValue={selectedRole.name}/>

                        {roleSettingsCategories.map(category => (
                            category.permissions.map((entry, index) => (
                                <div key={uuid()}>
                                    {index === 0 && <h3>{category.title}</h3>}
                                    <label>
                                        <input
                                            type="checkbox"
                                            name={entry.permission}
                                            checked={selectedRole.permissions.some(
                                                permission => permission.permission === entry.permission
                                            )}
                                            onChange={e => onPermissionChange(e, entry.permission)}
                                        />
                                        {entry.name}
                                    </label>
                                </div>
                            ))
                        ))}
                    </Form> :
                    <p><i>Ingen tillgangsnivå valgt</i></p>
                }
            </div>
        </div>
    )
}
