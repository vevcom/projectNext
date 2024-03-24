"use server"

import { sendMail as transportSendMail } from "@/server/notifications/email/send";
import { ActionReturn } from "@/actions/Types";
import { getUser } from "@/auth/getUser";
import { createActionError } from "@/actions/error";
import { sendEmailValidation } from "@/server/notifications/email/validation";
import { createZodActionError } from "@/actions/error";
import { safeServerCall } from "../safeServerCall";

export default async function sendMail(rawdata: FormData) : Promise<ActionReturn<void>> {
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