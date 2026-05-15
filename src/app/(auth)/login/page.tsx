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

    return <>
        <form className={styles.loginForm} onSubmit={handleSignIn}>
            <TextInput className={styles.textInput} label="Brukernavn" name="username" type="text"/>
            <TextInput className={styles.textInput} label="Passord" name="password" type="password"/>
            <BorderButton style={{ width: '100%', margin: '0' }}>
                Logg inn
            </BorderButton>
            <p style={{ color: 'red' }}>
                {error === 'CredentialsSignin' ? 'Feil brukernavn eller passord :(' : ''}
            </p>
        </form>

        <div className={styles.divider}>
            <span>eller</span>
        </div>

        <BorderButton style={{ width: '100%', margin: '0' }} onClick={() => signIn('feide', {
            redirect: true,
            callbackUrl: searchParams.get('callbackUrl') || '/users/me'
        })}>
            Logg inn med Feide
        </BorderButton>

        <Link href="/send-reset-password-email" className={styles.resetPasswordLink}>
            <p>
                Glemt passord?
            </p>
        </Link>

        <p className={styles.firstLoginText}>
            Er det første gang du logger inn? Da er det bare å logge inn med feide for å lage en bruker.
        </p>
    </>
}
