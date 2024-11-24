'use client'
import { registerOwnUser } from '@/actions/users/update'
import Form from '@/components/Form/Form'
import Checkbox from '@/components/UI/Checkbox'
import { SelectString } from '@/components/UI/Select'
import TextInput from '@/components/UI/TextInput'
import { useUser } from '@/auth/useUser'
import { sexConfig } from '@/services/users/ConfigVars'
import { SEX, type User } from '@prisma/client'
import { signIn, signOut } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

export default function RegistrationForm({
    userData,
    shouldLogOut,
}: {
    userData: Pick<User, 'mobile' | 'allergies' | 'sex'>,
    shouldLogOut?: boolean
}) {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/users/me'

    const userAuth = useUser({
        userRequired: true,
        shouldRedirect: true,
    })

    if (shouldLogOut) {
        signOut({
            redirect: false
        })
    }

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
        <TextInput label="Telefonnummer" name="mobile" defaultValue={userData.mobile ?? ''} />
        <TextInput label="Allergier / diett" name="allergies" defaultValue={userData.allergies ?? ''} />
        <TextInput type="password" label="Passord" name="password" onChange={(e) => { lastPassword = e.target.value }} />
        <TextInput type="password" label="Gjenta passord" name="confirmPassword" />
        <SelectString label="Kjønn" name="sex" options={sexOptions} defaultValue={userData.sex ?? undefined} />
        <Checkbox label="Jeg godtar vilkårene" name="acceptedTerms" />
    </Form>
}
