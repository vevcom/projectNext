'use client'

import { FormEvent } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

import TextInput from '@/components/TextInput/TextInput'
import PrimaryButton from '@/app/components/PrimaryButton/PrimaryButton'

export default function LogIn() {
    const searchParams = useSearchParams()

    const error = searchParams.get('error')

    async function handleSignIn(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        await signIn('credentials', {
            username: formData.get('username'),
            password: formData.get('password'),
            redirect: true,
            callbackUrl: searchParams.get('callbackUrl') || '/users/me'
        })
    }

    return <>
        <form onSubmit={handleSignIn}>
            <TextInput label='Brukernavn' name="username" type="text"/>
            <TextInput label="Passord" name="password" type="password"/>
            <PrimaryButton>Logg inn</PrimaryButton>
            <p style={{ color: 'red' }}>{error === 'CredentialsSignin' ? 'Feil brukernavn eller passord :(' : ''}</p>
        </form>
    </>
}
