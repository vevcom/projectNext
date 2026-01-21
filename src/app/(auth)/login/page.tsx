'use client'
import styles from './page.module.scss'
import TextInput from '@/UI/TextInput'
import BorderButton from '@/UI/BorderButton'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { FormEvent } from 'react'

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

    return <div className={styles.loginContainer}>
        <form onSubmit={handleSignIn}>
            <TextInput label="Brukernavn" name="username" type="text"/>
            <TextInput label="Passord" name="password" type="password"/>
            <BorderButton>Logg inn</BorderButton>
            <p><Link href="/send-reset-password-email" className={styles.resetPasswordLink}>Glemt passord?</Link></p>
            <p style={{ color: 'red', visibility: error === 'CredentialsSignin' ? 'visible' : 'hidden' }}>{"Feil brukernavn eller passord. :("}</p>
        </form>
        <BorderButton onClick={() => signIn('feide', {
            redirect: true,
            callbackUrl: searchParams.get('callbackUrl') || '/users/me'
        })}>Fortsett med Feide</BorderButton>
        <p>For å opprette bruker logg inn med Feide.</p>
    </div>
}
