"use server"

import { resetPasswordValidation } from "@/server/auth/validation"
import { ActionReturn } from "@/actions/Types"
import { createZodActionError } from "@/actions/error"
import { safeServerCall } from "@/actions/safeServerCall"
import { resetPasswordByEmail } from "@/server/auth/resetPassword"


export async function resetPasswordAction(rawdata: FormData): Promise<ActionReturn<string>> {

    const parse = resetPasswordValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    
    return await safeServerCall(() => resetPasswordByEmail(parse.data.email))
}