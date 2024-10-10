'use client'
import { createMailAddressExternalAction } from '@/actions/mail/mailAddressExternal/create'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import { useRouter } from 'next/navigation'


export default function CreateMailaddressExternal() {
    const { push } = useRouter()

    return <Form
        title="Opprett ny ekstern adresse"
        submitText="Opprett"
        action={createMailAddressExternalAction}
        successCallback={data => {
            if (!data) return
            push(`./mail/mailaddressExternal/${data.id}`)
        }}
    >
        <TextInput label="Adresse" name="address"></TextInput>
        <TextInput label="Beskrivelse" name="description"></TextInput>
    </Form>
}
