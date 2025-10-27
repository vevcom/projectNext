import { RequireUser } from '@/auth/auther/RequireUser'
import EmailRegistrationForm from './EmailregistrationForm'
import { readUserAction } from '@/services/users/actions'
import { notFound, redirect } from 'next/navigation'
import { Session } from '@/auth/session/Session'

export default async function Registeremail() {
    const { authorized, session } = RequireUser.staticFields({}).dynamicFields({}).auth(await Session.fromNextAuth())

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
