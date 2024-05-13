'use server'

import { resetPasswordValidation } from '@/server/auth/validation'
import { createZodActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { resetPasswordByEmail } from '@/server/auth/resetPassword'
import type { ActionReturn } from '@/actions/Types'


export async function resetPasswordAction(rawdata: FormData): Promise<ActionReturn<string>> {
    const parse = resetPasswordValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)

    return await safeServerCall(() => resetPasswordByEmail(parse.data.email))
}
