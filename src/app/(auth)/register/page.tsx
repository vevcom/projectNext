'use server'
import RegistrationForm from './RegistrationForm'
import { getUser } from '@/auth/getUser'
import { verifyUserEmailAction } from '@/actions/users/update'
import { readUser } from '@/services/users/read'
import { safeServerCall } from '@/actions/safeServerCall'
import { notFound, redirect } from 'next/navigation'

type PropTypes = {
    searchParams: {
        token?: string,
        callbackUrl?: string,
    }
}

export default async function Register({ searchParams }: PropTypes) {
    const { user, authorized } = await getUser({
        userRequired: false,
        shouldRedirect: false,
    })

    let userId = user?.id

    if (typeof searchParams.token === 'string') {
        const verify = await verifyUserEmailAction(searchParams.token)
        if (!verify.success) {
            console.log(verify)
            return <p>Token er ugyldig</p>
        }

        if (user && verify.data.id !== user.id) {
            // TODO: Logout
            throw new Error('Email is verified. Cannot continue registrations while another user is logged in.')
        }

        console.log(verify)
        userId = verify.data.id

        //TODO: Login the correct user
        // See https://github.com/nextauthjs/next-auth/discussions/5334
    } else if (!authorized || !user) {
        return notFound()
    }

    //TODO: change to action.
    const updatedUser = await safeServerCall(() => readUser({ id: userId }))
    if (!updatedUser.success) {
        return notFound()
    }

    if (updatedUser.data.acceptedTerms) {
        redirect(searchParams.callbackUrl ?? '/users/me')
    }

    if (!updatedUser.data.emailVerified) {
        redirect('/register-email')
    }

    return <RegistrationForm userData={updatedUser.data} />
}
