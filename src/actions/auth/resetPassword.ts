'use server'
import { getUser } from '@/auth/getUser'
import { safeServerCall } from '@/actions/safeServerCall'
import { emailValidation } from '@/services/notifications/validation'
import { sendResetPasswordMail } from '@/services/notifications/email/systemMail/resetPassword'
import { verifyResetPasswordToken } from '@/services/auth/resetPassword'
import { createZodActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'

export async function resetPasswordAction(rawdata: FormData): Promise<ActionReturn<string>> {
    const parse = emailValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)

    return await safeServerCall(() => sendResetPasswordMail(parse.data.email))
}

// For some reason the project doesn't build if getUser (or actually VevenAdapter specifically)
// isn't included for all actions. This is most likely a webpack issue and should probably be
// fixed in the future, but for now simply including it (even if it doesn't actually do anything) will work.
getUser({})

export async function verifyResetPasswordTokenAction(token: string): Promise<ActionReturn<{
    userId: number
}>> {
    return await safeServerCall(() => verifyResetPasswordToken(token))
}
