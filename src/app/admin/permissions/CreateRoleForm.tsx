'use client'

import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import { createRole } from '@/actions/permissions'

type PropTypes = {
    refreshRoles: () => void
}

export default function CreateRoleForm({ refreshRoles }: PropTypes) {
    return (
        <Form submitText="Legg til" action={createRole} successCallback={refreshRoles} >
            <TextInput label="Rollenavn" name="name"/>
        </Form>
    )
}
