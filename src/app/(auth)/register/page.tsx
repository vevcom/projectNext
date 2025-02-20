'use server'
import RegistrationForm from './RegistrationForm'
import { getUser } from '@/auth/getUser'
import { verifyUserEmailAction } from '@/actions/users/update'
import { readUser } from '@/services/users/read'
import { safeServerCall } from '@/actions/safeServerCall'
import { QueryParams } from '@/lib/query-params/queryParams'
import { notFound, redirect } from 'next/navigation'
import type { SearchParamsServerSide } from '@/lib/query-params/Types'

type PropTypes = SearchParamsServerSide

export default async function Register({ searchParams }: PropTypes) {
    const { user, authorized } = await getUser({
        userRequired: false,
        shouldRedirect: false,
    })

    let userId = user?.id
    let shouldLogOut = false

    const token = QueryParams.token.decode(await searchParams)
    const callbackUrl = QueryParams.callbackUrl.decode(await searchParams)

    if (token) {
        const verify = await verifyUserEmailAction(token)
        if (!verify.success) {
            redirect('./register')
        }

        if (user && verify.data.id !== user.id) {
            shouldLogOut = true
        }

        userId = verify.data.id
    } else if (!authorized || !user) {
        return notFound()
    }

    const updatedUser = await safeServerCall(() => readUser({ id: userId }))
    if (!updatedUser.success) {
        return notFound()
    }

    if (updatedUser.data.acceptedTerms) {
        redirect(callbackUrl ?? '/users/me')
    }

    if (!updatedUser.data.emailVerified) {
        redirect('/register-email')
    }

    return <RegistrationForm userData={updatedUser.data} shouldLogOut={shouldLogOut} />
}
