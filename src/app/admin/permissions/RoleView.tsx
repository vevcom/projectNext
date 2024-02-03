'use client'

import styles from './page.module.scss'
import CreateRoleForm from './CreateRoleForm'
import DeleteRoleForm from './DeleteRoleForm'
import { UpdateRoleForm } from './UpdateRoleForm'
import UserManagmentForm from './UserManagmentForm'
import { readUsersOfRole } from '@/actions/permissions'
import React, { useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/navigation'
import { User, type Prisma } from '@prisma/client'
import Link from 'next/link'

type RoleWithPermissions = Prisma.RoleGetPayload<{include: { permissions: { select: { permission: true } } } } >

type PropTypes = {
    roles: Array<RoleWithPermissions>
}

export default function RoleView({ roles: initalRoles }: PropTypes) {
    const router = useRouter()

    const [roles, setRoles] = useState<Array<RoleWithPermissions>>(initalRoles)
    const [selectedRole, setSelectedRole] = useState<RoleWithPermissions | undefined>()

    const [users, setUsers] = useState<Array<User>>([])

    function onRoleSelectChange(e: React.ChangeEvent<HTMLInputElement>) {
        const id = Number(e.target.value)

        setSelectedRole(roles.find(role => role.id === id))
    }

    async function refreshUsers() {
        if (!selectedRole) {
            setUsers([])
            return
        }

        const res = await readUsersOfRole(selectedRole.id)

        if (!res.success) {
            setUsers([])
            return
        }

        setUsers(res.data)
    }

    function refreshRoles() {
        router.refresh()
    }

    useEffect(() => {
        setRoles(initalRoles)

        if (!initalRoles.some(role => role.id === selectedRole?.id)) {
            setSelectedRole(undefined)
        }
    }, [initalRoles])

    useEffect(() => {
        refreshUsers().catch(() => console.log('whoopsie poopsie jeg er trøtt'))
    }, [selectedRole])

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
                        {roles.map((role, i) =>
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
                                    {
                                        <Link href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
                                            {['Vevcom', 'Theodor sin komité', 'Lolcom'][i % 3]}
                                        </Link>
                                    }
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
                <h2>Tillatelser</h2>
                {selectedRole ?
                    <>
                        <UpdateRoleForm selectedRole={selectedRole} refreshRoles={refreshRoles} />
                        <DeleteRoleForm selectedRoleId={selectedRole.id} refreshRoles={refreshRoles} />
                    </> :
                    <p><i>Ingen tillgangsnivå valgt</i></p>
                }
            </div>

            <div>
                <h2>Brukere</h2>
                <ul>
                    {users.map(user =>
                        <li key={uuid()}>{user.username}</li>
                    )}
                </ul>
                {selectedRole && <UserManagmentForm selectedRoleId={selectedRole.id} refreshUsers={refreshUsers} />}
            </div>
        </div>
    )
}
