'use server'

import ResetPasswordForm from './resetpasswordForm'
import { verifyResetPasswordToken } from '@/services/auth/resetPassword'
import { safeServerCall } from '@/actions/safeServerCall'
import { ServerError } from '@/services/error'


export default async function ResetPassword({
    searchParams,
}: {
    searchParams: Record<string, string | string[] | undefined>,
}) {
    const verify = await safeServerCall(async () => {
        if (typeof searchParams.token !== 'string') {
            throw new ServerError('JWT INVALID', 'JWT er formatert feil')
        }

        return await verifyResetPasswordToken(searchParams.token)
    })

    if (!verify.success) {
        const errorMessage = verify.error?.map(e => e.message).join('\n') ?? 'JWT er ugyldig'

        return <>
            <h1>Ops</h1>
            <p>{errorMessage}</p>
        </>
    }

    return <ResetPasswordForm token={searchParams.token as string} />
}
