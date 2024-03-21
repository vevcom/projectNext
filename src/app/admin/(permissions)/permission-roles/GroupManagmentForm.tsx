'use client'

import Form from '@/app/components/Form/Form'
import TextInput from '@/app/components/UI/TextInput'
import { addGroupToRoleAction, removeGroupFromRoleAction } from '@/actions/permissionRoles/update'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { ActionReturn } from '@/actions/Types'

type PropTypes = {
    selectedRoleId: number,
    refreshRolesGroups: () => void,
}

export default function GroupManagmentForm({ selectedRoleId, refreshRolesGroups }: PropTypes) {
    const { refresh } = useRouter()

    const [groupId, setGroupId] = useState<string>('')

    async function addGroup(data: FormData): Promise<ActionReturn<void, false>> {
        const res = await addGroupToRoleAction(data)
        refreshRolesGroups()
        refresh()
        return res
    }

    async function removeGroup(data: FormData): Promise<ActionReturn<void, false>> {
        const res = await removeGroupFromRoleAction(data)
        refreshRolesGroups()
        refresh()
        return res
    }

    return <>
        <Form submitText="Legg til gruppe" action={addGroup}>
            <input type="hidden" name="roleId" value={selectedRoleId} />
            <TextInput label="Gruppe ID" name="groupId" value={groupId} onChange={e => setGroupId(e.target.value)}/>
            <label>
                <input type="checkbox" name="forAdminsOnly" value="true"/>
                Kun for administratorere
            </label>

        </Form>

        <Form
            submitText="Fjern gruppe"
            submitColor="red"
            action={removeGroup}
        >
            <input type="hidden" name="roleId" value={selectedRoleId} />
            <input type="hidden" name="groupId" value={groupId}/>
        </Form>
    </>
}
