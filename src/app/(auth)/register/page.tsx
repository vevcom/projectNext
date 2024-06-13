'use server'
import RegistrationForm from './RegistrationForm'
import { getUser } from '@/auth/getUser'
import { verifyUserEmailAction } from '@/actions/users/update'
import { readUser } from '@/server/users/read'
import { safeServerCall } from '@/actions/safeServerCall'
import { notFound, redirect } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default async function Register({
    searchParams,
}: {
    searchParams: {
        token?: string,
        callbackUrl?: string,
    }
}) {
    const { user, authorized } = await getUser({
        userRequired: false,
        shouldRedirect: false,
    })

    if (typeof searchParams.token === 'string') {
        const verify = await verifyUserEmailAction(searchParams.token)
        if (!verify.success) {
            console.log(verify)
            return <p>Token er ugyldig</p>
        }

        if (user && verify.data.id !== user.id) {
            // TODO: Logout
            console.log("Should logout")
        }

        console.log(verify)

        //TODO: Login the correct user
        // See https://github.com/nextauthjs/next-auth/discussions/5334
    } else if (!authorized || !user) {
        return notFound()
    }

    const updatedUser = await safeServerCall(() => readUser({ id: user.id }))
    if (!updatedUser.success) {
        return notFound()
    }

    if (updatedUser.data.acceptedTerms) {
        redirect(searchParams.callbackUrl ?? 'users/me')
    }

    if (!updatedUser.data.emailVerified) {
        redirect('/registeremail')
    }

    return <RegistrationForm />
}
