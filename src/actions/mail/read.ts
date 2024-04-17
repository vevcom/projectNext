"use server"

import { MailListTypes } from "@/server/mail/Types";
import { safeServerCall } from "../safeServerCall";
import { readMailFlow } from "@/server/mail/read";


export async function readMailFlowAction(filter: MailListTypes, id: number) {

    // TODO: permission check

    return safeServerCall(() => readMailFlow({
        filter,
        id,
    }))
}