"use server"

import { sendMail as transportSendMail } from "@/server/notifications/email";
import { ActionReturn } from "@/actions/Types";
import { getUser } from "@/auth/user";
import { createActionError } from "@/actions/error";
import { sendMailSchema } from "./schema";
import { createZodActionError } from "@/actions/error";

export default async function sendMail(rawdata: FormData) : Promise<ActionReturn<boolean>> {
    const { authorized, status } = await getUser({
        requiredPermissions: ['MAIL_SEND'],
    })

    if (!authorized) {
        return createActionError(status)
    }

    const parse = sendMailSchema.safeParse(rawdata)

    if (!parse.success) {
        return createZodActionError(parse)
    }

    await transportSendMail(parse.data);

    return { success: true, data: true }
}