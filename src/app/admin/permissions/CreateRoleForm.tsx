'use client'

import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import { createRole } from '@/actions/permissions'
import { useState } from 'react'

type PropTypes = {
    refreshRoles: () => void
}

export default function CreateRoleForm({ refreshRoles }: PropTypes) {
    const [roleName, setRoleName] = useState<string>('')

    function callback() {
        setRoleName('')
        refreshRoles()
    }

    return (
        <Form submitText="Legg til" action={createRole} successCallback={callback} >
            <TextInput label="Rollenavn" name="name" value={roleName} onChange={e => setRoleName(e.target.value)} />
        </Form>
    )
}
