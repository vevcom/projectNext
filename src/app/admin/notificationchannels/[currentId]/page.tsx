
import { notFound } from "next/navigation"
import { getUser } from "@/auth/getUser"
import ChannelSettings from "./channelSettings"
import { readAllNotificationChannelsAction } from "@/actions/notifications/channel/read"
import { readAllMailAliasesAction } from "@/actions/mail/alias/read"


export default async function Channels({ params } : {
    params: {
        currentId: string
    }
}) {

    const [channels, mailAliases] = await Promise.all([
        readAllNotificationChannelsAction(),
        readAllMailAliasesAction(),
    ])

    if (!channels.success || !mailAliases.success) {
        // TODO: Handle error
        notFound();
    }

    const currentId = Number(params.currentId)
    const selected = channels.data.find(c => c.id === currentId);

    if (!selected) {
        notFound();
    }

    return <ChannelSettings channels={channels.data} currentChannel={selected} mailAliases={mailAliases.data} />
}