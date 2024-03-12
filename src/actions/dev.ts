"use server"
import { sendMail } from "@/server/notifications/email";

export async function sendDevMail() {
    await sendMail();
}