'use client'

import Form from '@/app/components/Form/Form'
import TextInput from '@/app/components/UI/TextInput'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { ActionReturn } from '@/actions/Types'

type PropTypes = {
    selectedRoleId: number,
}

export default function UserManagmentForm({ selectedRoleId }: PropTypes) {
    const { refresh } = useRouter()

    const [username, setUsername] = useState<string>('')

    async function addUser(data: FormData): Promise<ActionReturn<void, false>> {
        // Removed temporaraly for refactor
        console.warn('NOT IMPLEMENTED RIGHT NOW!', data)
        refresh()
        return { success: false, errorCode: 'UNKNOWN ERROR' }
    }

    async function removeUser(data: FormData): Promise<ActionReturn<void, false>> {
        // Removed temporaraly for refactor
        console.warn('NOT IMPLEMENTED RIGHT NOW!', data)
        refresh()
        return { success: false, errorCode: 'UNKNOWN ERROR' }
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
