import { EmailVerifiedWrapper } from './EmailVerifiedWrapper'
import { getUser } from '@/auth/getUser'
import { verifyEmailAction } from '@/actions/auth/auth'
import { QueryParams } from '@/lib/query-params/queryParams'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import type { SearchParamsServerSide } from '@/lib/query-params/Types'

type PropTypes = SearchParamsServerSide

export default async function Register({ searchParams }: PropTypes) {
    const token = QueryParams.token.decode(await searchParams)
    if (!token) {
        notFound()
    }

    const { user } = await getUser({
        userRequired: false,
        shouldRedirect: false,
    })

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
