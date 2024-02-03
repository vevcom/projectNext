'use client'

import styles from './page.module.scss'
import CreateRoleForm from './CreateRoleForm'
import DeleteRoleForm from './DeleteRoleForm'
import { UpdateRoleForm } from './UpdateRoleForm'
import React, { useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/navigation'
import type { Prisma } from '@prisma/client'

type RoleWithPermissions = Prisma.RoleGetPayload<{include: { permissions: { select: { permission: true } } } } >

type PropTypes = {
    roles: Array<RoleWithPermissions>
}

export default function RoleView({ roles: initalRoles }: PropTypes) {
    const router = useRouter()

    const [roles, setRoles] = useState<Array<RoleWithPermissions>>(initalRoles)
    const [selectedRole, setSelectedRole] = useState<RoleWithPermissions | undefined>()

    useEffect(() => {
        setRoles(initalRoles)

        if (!initalRoles.some(role => role.id === selectedRole?.id)) {
            setSelectedRole(undefined)
        }
    }, [initalRoles])

    function onRoleSelectChange(e: React.ChangeEvent<HTMLInputElement>) {
        const id = Number(e.target.value)

        setSelectedRole(roles.find(role => role.id === id))
    }

    function refreshRoles() {
        router.refresh()
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
                            <td className={styles.newRoleForm}>
                                <h2>Legg til ny rolle</h2>
                                <CreateRoleForm refreshRoles={refreshRoles}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className={styles.permissionsSettings}>
                <h2>Innstillinger</h2>
                {selectedRole ?
                    <>
                        <UpdateRoleForm selectedRole={selectedRole} refreshRoles={refreshRoles}/>
                        <DeleteRoleForm selectedRoleId={selectedRole.id} refreshRoles={refreshRoles} />
                    </> :
                    <p><i>Ingen tillgangsnivå valgt</i></p>
                }
            </div>
        </div>
    )
}
