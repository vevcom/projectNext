import EmailRegistrationForm from './EmailregistrationForm'
import { getUser } from '@/auth/getUser'
import { readUserAction } from '@/services/users/actions'
import { notFound, redirect } from 'next/navigation'

export default async function Registeremail() {
    const { authorized, user } = await getUser({
        userRequired: true,
    })

    if (!authorized) notFound()

    const updatedUser = await readUserAction({ id: user.id })

    if (!updatedUser.success) {
        return notFound()
    }

    if (updatedUser.data.acceptedTerms) {
        redirect('/users/me')
    }

    if (updatedUser.data.emailVerified) {
        redirect('/register')
    }

    return <EmailRegistrationForm user={updatedUser.data} />
}
