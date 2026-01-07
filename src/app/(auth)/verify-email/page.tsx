import { EmailVerifiedWrapper } from './EmailVerifiedWrapper'
import { QueryParams } from '@/lib/queryParams/queryParams'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { ServerSession } from '@/auth/session/ServerSession'
import { verifyEmailAction } from '@/services/auth/actions'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import type { SearchParamsServerSide } from '@/lib/queryParams/types'

type PropTypes = SearchParamsServerSide

export default async function Register({ searchParams }: PropTypes) {
    const token = QueryParams.token.decode(await searchParams)
    if (!token) {
        notFound()
    }

    const user = (await ServerSession.fromNextAuth()).user

    const userId = user?.id
    const updatedUser = unwrapActionReturn(await verifyEmailAction({ params: { token } }))

    if (!userId) {
        // TODO: If the user arrives here by an invitation email
        // or from another verify email email, we should log the user inn,
        // not just ask the user to do so. Escpecially since invited users can't login with feide.
        return <EmailVerifiedWrapper>
            <Link href="/login">Logg inn</Link>
        </EmailVerifiedWrapper>
    }

    if (userId !== updatedUser.id) {
        return <EmailVerifiedWrapper>
            <p>Ups, du er visst logged inn som noen andre, dette kan skape litt problemer.</p>
            <Link href="/logout">Logg ut</Link>
        </EmailVerifiedWrapper>
    }

    if (updatedUser.acceptedTerms) {
        return <EmailVerifiedWrapper>
            <Link href="/users/me">Gå til profil siden</Link>
        </EmailVerifiedWrapper>
    }

    redirect('/register')
}
