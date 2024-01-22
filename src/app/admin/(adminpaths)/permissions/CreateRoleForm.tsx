'use client'

import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import { createRole } from '@/actions/permissions'
import { useRouter } from 'next/navigation'

export default function CreateRoleForm() {
    const router = useRouter()

    return (
        <Form action={createRole} successCallback={router.refresh} submitText='Legg til rolle'>
            <TextInput label="Navn" name="name"/>
        </Form>
    )
}