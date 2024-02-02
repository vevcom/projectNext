'use client'

import { destroyRole } from '@/actions/permissions'
import Form from '@/app/components/Form/Form'

type PropType = {
    selectedRoleId: number
    refreshRoles: () => void
}

export default function DeleteRoleButton({ selectedRoleId, refreshRoles }: PropType) {
    return <Form
        submitText="Slett"
        submitColor="red"
        confirmation={{ confirm: true, text: 'Er du sikker på at du vil slette denne rollen?' }}
        action={() => destroyRole(selectedRoleId)}
        successCallback={refreshRoles}
    />
}
