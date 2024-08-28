'use client'
import { registerOwnUser } from '@/actions/users/update'
import Form from '@/app/components/Form/Form'
import Checkbox from '@/app/components/UI/Checkbox'
import { SelectString } from '@/app/components/UI/Select'
import TextInput from '@/app/components/UI/TextInput'
import { useUser } from '@/auth/useUser'
import { sexConfig } from '@/server/users/ConfigVars'
import { SEX } from '@prisma/client'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

export default function RegistrationForm() {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/users/me'

    const userAuth = useUser({
        userRequired: true,
        shouldRedirect: true,
    })

    const lastUsername = userAuth.user?.username
    let lastPassword: string = ''

    const sexOptions = Object.values(SEX).map(sex => ({
        value: sex,
        label: sexConfig[sex].label
    }))

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
        <TextInput type="password" label="Passord" name="password" onChange={(e) => {lastPassword = e.target.value}}/>
        <TextInput type="password" label="Gjenta passord" name="confirmPassword" />
        <SelectString label="Kjønn" name="sex" options={sexOptions}/>
        <Checkbox label="Jeg godtar vilkårene" name="acceptedTerms" />
    </Form>
}
