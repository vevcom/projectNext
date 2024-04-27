"use server"
import PageWrapper from "@/app/components/PageWrapper/PageWrapper";
import NotificaionForm from "./notificationForm";
import { readNotificaitonChannels } from "@/actions/notifications/read";
import { ServerError } from "@/server/error";




export default async function SendNotification() {

    const channels = await readNotificaitonChannels();

    if (!channels.success) {
        console.error(channels)
        throw new ServerError("UNKNOWN ERROR", "Failed to load notificaionChannels");
    }

    return <PageWrapper
        title="Send Varsel"
    >
        <NotificaionForm channels={channels.data}/>
    </PageWrapper>
}