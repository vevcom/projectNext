'use client'
import { resetPasswordAction } from '@/actions/auth/auth'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'

type PropTypes = {
    token: string
}

export default function ResetPasswordForm({ token }: PropTypes) {
    return <Form
        title="Nullstill passord"
        submitText="Endre passord"
        action={resetPasswordAction.bind(null, { token })}
        navigateOnSuccess="/login"
    >
        <TextInput name="password" type="password" label="Passord" />
        <TextInput name="confirmPassword" type="password" label="Bekreft passord" />
    </Form>
}
