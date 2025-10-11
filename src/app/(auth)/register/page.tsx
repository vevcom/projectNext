import RegistrationForm from './RegistrationForm'
import { getUser } from '@/auth/getUser'
import { QueryParams } from '@/lib/query-params/queryParams'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readUserAction } from '@/actions/users/read'
import { notFound, redirect } from 'next/navigation'
import type { SearchParamsServerSide } from '@/lib/query-params/Types'

type PropTypes = SearchParamsServerSide

export default async function Register({ searchParams }: PropTypes) {
    const { user, authorized } = await getUser({
        userRequired: false,
        shouldRedirect: false,
    })

    const callbackUrl = QueryParams.callbackUrl.decode(await searchParams)

    if (!authorized || !user) {
        return notFound()
    }

    const updatedUser = unwrapActionReturn(await readUserAction({
        params: {
            id: user.id
        }
    }))

    if (updatedUser.acceptedTerms) {
        redirect(callbackUrl ?? '/users/me')
    }

    if (!updatedUser.emailVerified) {
        const linkEnding = callbackUrl ? `?callbackUrl=${callbackUrl}` : ''
        redirect(`/register-email${linkEnding}`)
    }

    return <RegistrationForm userData={updatedUser} />
}
