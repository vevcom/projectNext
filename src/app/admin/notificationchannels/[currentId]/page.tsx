
import { notFound } from "next/navigation"
import { getUser } from "@/auth/getUser"
import ChannelSettings from "./channelSettings"
import { readAllNotificationChannelsAction } from "@/actions/notifications/channel/read"


export default async function Channels({ params } : {
    params: {
        currentId: string
    }
}) {

    const channels = await readAllNotificationChannelsAction();

    if (!channels.success) {
        // TODO: Handle error
        notFound();
    }

    const currentId = Number(params.currentId)
    const selected = channels.data.find(c => c.id === currentId);

    if (!selected) {
        notFound();
    }

    return <ChannelSettings channels={channels.data} currentChannel={selected}/>
}