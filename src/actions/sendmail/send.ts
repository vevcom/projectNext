"use server"

import { sendMail as transportSendMail } from "@/server/notifications/email";
import { ActionReturn } from "../Types";


export default async function sendMail(rawdata: FormData) : Promise<ActionReturn<boolean>> {

    

    await transportSendMail()

    return { success: true, data: true }
}