'use client'

import { addUserToRole, removeUserFromRole } from '@/actions/permissions'
import Form from '@/app/components/Form/Form'
import TextInput from '@/app/components/UI/TextInput'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type PropTypes = {
    selectedRoleId: number,
}

export default function UserManagmentForm({ selectedRoleId }: PropTypes) {
    const { refresh } = useRouter()

    const [username, setUsername] = useState<string>('')

    async function addUser(data: FormData) {
        const result = await addUserToRole(data)
        refresh()
        return result
    }

    async function removeUser(data: FormData) {
        const result = await removeUserFromRole(data)
        refresh()
        return result
    }

    return <>
        <Form submitText="Legg til bruker" action={addUser}>
            <input type="hidden" name="roleId" value={selectedRoleId} />
            <TextInput label="Brukernavn" name="username" value={username} onChange={e => setUsername(e.target.value)}/>
        </Form>

        <Form
            submitText="Fjern bruker"
            submitColor="red"
            action={removeUser}
        >
            <input type="hidden" name="roleId" value={selectedRoleId} />
            <input type="hidden" name="username" value={username}/>
        </Form>
    </>
}
