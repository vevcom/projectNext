'use client'

import { destroyRoleAction } from '@/actions/permissionRoles/destroy'
import Form from '@/app/components/Form/Form'
import { useRouter } from 'next/navigation'

type PropType = {
    selectedRoleId: number
}

export default function DeleteRoleForm({ selectedRoleId }: PropType) {
    const { refresh } = useRouter()

    return <Form
        submitText="Slett"
        submitColor="red"
        confirmation={{ confirm: true, text: 'Er du sikker på at du vil slette denne rollen?' }}
        action={() => destroyRoleAction(selectedRoleId)}
        successCallback={refresh}
    />
}
