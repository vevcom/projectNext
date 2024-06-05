'use server'
import RegistrationForm from './RegistrationForm'
import { getUser } from '@/auth/getUser'
import { verifyUserEmailAction } from '@/actions/users/update'
import { readUser } from '@/server/users/read'
import { safeServerCall } from '@/actions/safeServerCall'
import { notFound, redirect } from 'next/navigation'

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
            return <p>Token er ugyldig</p>
        }

        if (!authorized || !user) {
            return <p>Tusen takk! Eposten er verifisert.</p>
        }
    }

    if (!authorized || !user) {
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
