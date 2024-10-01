'use server'
import { getUser } from '@/auth/getUser'
import { safeServerCall } from '@/actions/safeServerCall'
import type { ActionReturn } from '@/actions/Types'
import { emailValidation } from '@/services/notifications/validation'
import { sendResetPasswordMail } from '@/services/notifications/email/systemMail/resetPassword'
import { verifyResetPasswordToken } from '@/services/auth/resetPassword'
import { createZodActionError } from '@/actions/error'

export async function resetPasswordAction(rawdata: FormData): Promise<ActionReturn<string>> {
    const parse = emailValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)

    return await safeServerCall(() => sendResetPasswordMail(parse.data.email))
}

export async function verifyResetPasswordTokenAction(token: string): Promise<ActionReturn<{
    userId: number
}>> {
    getUser({})
    return await safeServerCall(() => verifyResetPasswordToken(token))
}
