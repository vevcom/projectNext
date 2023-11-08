"use client"

import { FormEvent } from 'react'
import { signOut } from 'next-auth/react'
import PrimaryButton from '@/app/components/PrimaryButton/PrimaryButton'

export default async function LogOut() {
    async function handleSignOut() {
        await signOut({
            redirect: true,
            callbackUrl: '/'
        })
    }

    return (
        <PrimaryButton type='button' onClick={handleSignOut}>Logg ut</PrimaryButton>
    )
}
