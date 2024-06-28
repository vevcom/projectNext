'use client'

import { resetPasswordAction } from '@/actions/users/update'
import Form from '@/app/components/Form/Form'
import TextInput from '@/app/components/UI/TextInput'
import { useRouter } from 'next/navigation'


export default function ResetPasswordForm({
    token,
}: {
    token: string
}) {
    const { push } = useRouter()

    return <Form
        title="Nullstill passord"
        submitText="Endre passord"
        action={resetPasswordAction.bind(null, token)}
        successCallback={() => push('/login')}
    >
        <TextInput name="password" type="password" label="Passord" />
        <TextInput name="confirmPassword" type="password" label="Bekreft passord" />
    </Form>
}
