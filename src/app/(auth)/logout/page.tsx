'use client'

import { signOut } from 'next-auth/react'
import BorderButton from '@/UI/BorderButton'

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
