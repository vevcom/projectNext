import ResetPasswordForm from './resetpasswordForm'
import { verifyResetPasswordTokenAction } from '@/services/auth/actions'
import { QueryParams } from '@/lib/query-params/queryParams'
import type { SearchParamsServerSide } from '@/lib/query-params/types'

type PropTypes = SearchParamsServerSide

export default async function ResetPassword({ searchParams }: PropTypes) {
    const token = QueryParams.token.decode(await searchParams)

    if (!token) {
        return <>
            <h1>Ops</h1>
            <p>Token mangler</p>
        </>
    }
    const verify = await verifyResetPasswordTokenAction({ token })

    if (!verify.success) {
        const errorMessage = verify.error?.map(e => e.message).join('\n') ?? 'JWT er ugyldig'

        return <>
            <h1>Ops</h1>
            <p>{errorMessage}</p>
        </>
    }

    return <ResetPasswordForm token={token} />
}
