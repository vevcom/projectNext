'use client'
import { registerUser } from '@/actions/users/create'
import Form from '@/app/components/Form/Form'
import Checkbox from '@/app/components/UI/Checkbox'
import Select from '@/app/components/UI/Select'
import TextInput from '@/app/components/UI/TextInput'
import { useUser } from '@/auth/client'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

export default async function Register() {
    const searchParams = useSearchParams()
    let callbackUrl = searchParams.get('callbackUrl') || 'users/me'

    const router = useRouter()

    if (callbackUrl.substring(0, 4) === 'http') {
        let indexOfSlash = callbackUrl.search('/') + 2
        callbackUrl = callbackUrl.substring(indexOfSlash)
        indexOfSlash = callbackUrl.search('/')
        callbackUrl = callbackUrl.substring(indexOfSlash)
    }

    const userAuth = useUser()
    if (userAuth.status !== 'authenticated') {
        router.push('/login')
    }

    if (userAuth.user?.acceptedTerms) {
        router.push('/users/me')
    }

    const sexOptions = [
        { value: 'FEMALE', label: 'Kvinne' },
        { value: 'MALE', label: 'Mann' },
        { value: 'OTHER', label: 'Annet' },
    ]

    const lastUsername = userAuth.user?.username
    let lastPassword: string = ''

    async function callback() {
        await signIn('credentials', {
            username: lastUsername,
            password: lastPassword,
            redirect: true,
            callbackUrl
        })
    }

    return <Form
        title="Registrer bruker"
        submitText="Registrer bruker"
        action={registerUser}
        successCallback={callback}
    >
        <TextInput label="Brukernavn" name="username" disabled={true} value={userAuth.user?.username}/>
        <TextInput label="Epost" name="email" defaultValue={userAuth.user?.email}/>
        <TextInput label="Passord" name="password" onChange={(e) => {lastPassword = e.target.value}}/>
        <TextInput label="Gjenta passord" name="confirmPassword" />
        <Select name="sex" label="Kjønn" options={sexOptions}/>
        <Checkbox label="Jeg godtar vilkårene" name="acceptedTerms" />
    </Form>
}
