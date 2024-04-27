import { readNotificaitonChannels } from "@/actions/notifications/read"
import { notFound } from "next/navigation"
import { getUser } from "@/auth/getUser"
import ChannelSettings from "./channelSettings"
import PageWrapper from "@/app/components/PageWrapper/PageWrapper"


export default async function Channels({ params } : {
    params: {
        currentId: string
    }
}) {

    await getUser({
        requiredPermissions: [[ 'NOTIFICATION_CHANNEL_READ' ]],
        userRequired: true,
        shouldRedirect: true,
    });

    const channels = await readNotificaitonChannels();

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