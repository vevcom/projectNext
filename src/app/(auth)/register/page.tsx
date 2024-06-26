'use client'
import { registerOwnUser } from '@/actions/users/update'
import Form from '@/app/components/Form/Form'
import Checkbox from '@/app/components/UI/Checkbox'
import Select from '@/app/components/UI/Select'
import TextInput from '@/app/components/UI/TextInput'
import { useUser } from '@/auth/useUser'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

export default async function Register() {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || 'users/me'

    const { push } = useRouter()

    const userAuth = useUser({
        userRequired: true,
        shouldRedirect: true,
    })

    if (userAuth.user?.acceptedTerms) {
        push('/users/me')
    }

    const sexOptions = [
        { value: 'FEMALE', label: 'Kvinne' },
        { value: 'MALE', label: 'Mann' },
        { value: 'OTHER', label: 'Annet' },
    ]

    const lastUsername = userAuth.user?.username
    let lastPassword: string = ''

    return <Form
        title="Registrer bruker"
        submitText="Registrer bruker"
        action={registerOwnUser}
        successCallback={() => signIn('credentials', {
            username: lastUsername,
            password: lastPassword,
            redirect: true,
            callbackUrl
        })}
    >
        <TextInput label="Brukernavn" name="username" disabled={true} value={userAuth.user?.username}/>
        <TextInput label="Epost" name="email" defaultValue={userAuth.user?.email}/>
        <TextInput label="Passord" name="password" onChange={(e) => {lastPassword = e.target.value}}/>
        <TextInput label="Gjenta passord" name="confirmPassword" />
        <Select label="Kjønn" name="sex" options={sexOptions}/>
        <Checkbox label="Jeg godtar vilkårene" name="acceptedTerms" />
    </Form>
}
