import ResetPasswordForm from './resetpasswordForm'
import { verifyResetPasswordTokenAction } from '@/actions/auth/resetPassword'

type PropTypes = {
    searchParams: Record<string, string | string[] | undefined>
}

export default async function ResetPassword({ searchParams }: PropTypes) {
    if (!searchParams.token || typeof searchParams.token !== 'string') {
        return <>
            <h1>Ops</h1>
            <p>Token mangler</p>
        </>
    }
    const verify = await verifyResetPasswordTokenAction(searchParams.token)

    if (!verify.success) {
        const errorMessage = verify.error?.map(e => e.message).join('\n') ?? 'JWT er ugyldig'

        return <>
            <h1>Ops</h1>
            <p>{errorMessage}</p>
        </>
    }

    return <ResetPasswordForm token={searchParams.token} />
}
