'use client'
import styles from './page.module.scss'
import CreateRoleForm from './CreateRoleForm'
import DeleteRoleForm from './DeleteRoleForm'
import { UpdateRoleForm } from './UpdateRoleForm'
import GroupManagmentForm from './GroupManagmentForm'
import { readGroupsOfRoleAction } from '@/actions/permissionRoles/read'
import React, { useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import type { RolesGroups } from '@prisma/client'
import type { ExpandedRole } from '@/services/permissionRoles/Types'

type PropTypes = {
    roles: ExpandedRole[]
}

export default function RoleView({ roles: initalRoles }: PropTypes) {
    const [roles, setRoles] = useState<ExpandedRole[]>(initalRoles)
    const [selectedRole, setSelectedRole] = useState<ExpandedRole | undefined>()

    const [rolesGroups, setRolesGroups] = useState<RolesGroups[]>([])

    function onRoleSelectChange(e: React.ChangeEvent<HTMLInputElement>) {
        const id = Number(e.target.value)

        setSelectedRole(roles.find(role => role.id === id))
    }

    async function refreshRolesGroups() {
        if (!selectedRole) {
            setRolesGroups([])
            return
        }

        const res = await readGroupsOfRoleAction(selectedRole.id)

        if (!res.success) {
            setRolesGroups([])
            return
        }

        setRolesGroups(res.data)
    }

    useEffect(() => {
        setRoles(initalRoles)

        if (!initalRoles.some(role => role.id === selectedRole?.id)) {
            setSelectedRole(undefined)
        }
    }, [initalRoles])

    useEffect(() => {
        refreshRolesGroups().catch(() => { throw new Error('Could not refresh role grou') })
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
                                    {role.groups.map(group => `${group.groupId}${group.forAdminsOnly ? '*' : ''}`)}
                                </td>
                            </tr>
                        )}

                        <tr>
                            <td className={styles.newRoleForm}>
                                <h2>Legg til ny rolle</h2>
                                <CreateRoleForm />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className={styles.permissionsSettings}>
                <h2>Tillganger</h2>
                {selectedRole ?
                    <>
                        <UpdateRoleForm selectedRole={selectedRole} />
                        <DeleteRoleForm selectedRoleId={selectedRole.id} />
                    </> :
                    <p><i>Ingen tillgangsrolle valgt</i></p>
                }
            </div>

            <div>
                <h2>Grupper</h2>
                <ul>
                    {rolesGroups.map(group =>
                        <li key={uuid()}>{group.groupId}</li>
                    )}
                </ul>
                { selectedRole &&
                    <GroupManagmentForm selectedRoleId={selectedRole.id} refreshRolesGroups={refreshRolesGroups}/>
                }
            </div>
        </div>
    )
}
