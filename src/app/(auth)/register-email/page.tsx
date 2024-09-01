'use server'
import EmailRegistrationForm from './EmailregistrationForm'
import { getUser } from '@/auth/getUser'
import { safeServerCall } from '@/actions/safeServerCall'
import { readUser } from '@/services/users/read'
import { notFound, redirect } from 'next/navigation'

export default async function Registeremail() {
    const { authorized, user } = await getUser({
        userRequired: true,
    })

    if (!authorized) notFound()

    const updatedUser = await safeServerCall(() => readUser({ id: user.id }))
    if (!updatedUser.success) {
        return notFound()
    }

    if (updatedUser.data.acceptedTerms) {
        redirect('/users/me')
    }

    if (updatedUser.data.emailVerified) {
        redirect('/register')
    }

    return <EmailRegistrationForm />
}
