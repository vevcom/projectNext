import EmailRegistrationForm from './EmailregistrationForm'
import { ServerSession } from '@/auth/session/ServerSession'
import { RequireUser } from '@/auth/auther/RequireUser'
import { readUserAction } from '@/services/users/actions'
import { notFound, redirect } from 'next/navigation'

export default async function Registeremail() {
    const { authorized, session } = RequireUser.staticFields({}).dynamicFields({}).auth(
        await ServerSession.fromNextAuth()
    )

    if (!authorized) notFound()

    const updatedUser = await readUserAction({ params: { id: session.user.id } })

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
