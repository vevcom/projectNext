'use client'

import BorderButton from '@/UI/BorderButton'
import { signOut } from 'next-auth/react'

export default function LogOut() {
    async function handleSignOut() {
        await signOut({
            redirect: true,
            callbackUrl: '/'
        })
    }

    return (
        <BorderButton type="button" onClick={handleSignOut}>Logg ut</BorderButton>
    )
}
