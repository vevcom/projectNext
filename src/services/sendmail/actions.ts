'use server'

import { createActionError, createZodActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { sendMail as transportSendMail } from '@/services/notifications/email/send'
import { sendEmailValidation } from '@/services/notifications/email/validation'
import type { ActionReturn } from '@/actions/Types'

export default async function sendMail(rawdata: FormData): Promise<ActionReturn<void>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['MAIL_SEND']],
    })

    if (!authorized) {
        return createActionError(status)
    }

    const parse = sendEmailValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => transportSendMail(data))
}
