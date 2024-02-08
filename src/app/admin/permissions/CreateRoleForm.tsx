'use client'

import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import { createRole } from '@/actions/permissions/create'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateRoleForm() {
    const { refresh } = useRouter()

    const [roleName, setRoleName] = useState<string>('')

    function callback() {
        setRoleName('')
        refresh()
    }

    return (
        <Form submitText="Legg til" action={createRole} successCallback={callback} >
            <TextInput label="Rollenavn" name="name" value={roleName} onChange={e => setRoleName(e.target.value)} />
        </Form>
    )
}
