'use server'

import { createZodActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { sendResetPasswordMail } from '@/server/notifications/email/systemMail/resetPassword'
import { emailValidation } from '@/server/notifications/validation'
import type { ActionReturn } from '@/actions/Types'


export async function resetPasswordAction(rawdata: FormData): Promise<ActionReturn<string>> {
    const parse = emailValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)

    return await safeServerCall(() => sendResetPasswordMail(parse.data.email))
}
