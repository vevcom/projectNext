import RegistrationForm from './RegistrationForm'
import { QueryParams } from '@/lib/queryParams/queryParams'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readUserAction } from '@/services/users/actions'
import { Session } from '@/auth/session/Session'
import { notFound, redirect } from 'next/navigation'
import type { SearchParamsServerSide } from '@/lib/queryParams/types'

type PropTypes = SearchParamsServerSide

export default async function Register({ searchParams }: PropTypes) {
    const user = (await Session.fromNextAuth()).user
    const callbackUrl = QueryParams.callbackUrl.decode(await searchParams)
    if (!user) {
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
