'use client'
import TextInput from '@/UI/TextInput'
import BorderButton from '@/UI/BorderButton'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import type { FormEvent } from 'react'
import Link from 'next/link'
import styles from './page.module.scss'

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
            <TextInput label="Brukernavn" name="username" type="text"/>
            <TextInput label="Passord" name="password" type="password"/>
            <BorderButton>Logg inn</BorderButton>
            <p style={{ color: 'red' }}>{error === 'CredentialsSignin' ? 'Feil brukernavn eller passord :(' : ''}</p>
        </form>
        <BorderButton onClick={() => signIn('feide', {
            redirect: true,
            callbackUrl: searchParams.get('callbackUrl') || '/users/me'
        })}>Logg inn med Feide</BorderButton>
        <Link href="/resetpassword" className={styles.resetPasswordLink}>Glemt passord?</Link>
        <p>Er det første gang du logger inn? Da er det bare å logge inn med feide for å lage en bruker.</p>
    </>
}
