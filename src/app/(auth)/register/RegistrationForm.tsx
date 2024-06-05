'use client'
import { registerOwnUser } from '@/actions/users/update'
import Form from '@/app/components/Form/Form'
import Checkbox from '@/app/components/UI/Checkbox'
import Select from '@/app/components/UI/Select'
import TextInput from '@/app/components/UI/TextInput'
import { useUser } from '@/auth/useUser'
import { sexOptions } from '@/server/users/ConfigVars'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

export default async function RegistrationForm() {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/users/me'

    const userAuth = useUser({
        userRequired: true,
        shouldRedirect: true,
    })

    const lastUsername = userAuth.user?.username
    let lastPassword: string = ''

    return <Form
        title="Ekstra brukerinformasjon"
        submitText="Fullfør registrering"
        action={registerOwnUser}
        successCallback={() => signIn('credentials', {
            username: lastUsername,
            password: lastPassword,
            redirect: true,
            callbackUrl
        })}
    >
        <TextInput label="Telefonnummer" name="mobile" />
        <TextInput label="Allergier / diett" name="allergies" />
        <TextInput label="Passord" name="password" onChange={(e) => {lastPassword = e.target.value}}/>
        <TextInput label="Gjenta passord" name="confirmPassword" />
        <Select label="Kjønn" name="sex" options={sexOptions}/>
        <Checkbox label="Jeg godtar vilkårene" name="acceptedTerms" />
    </Form>
}
