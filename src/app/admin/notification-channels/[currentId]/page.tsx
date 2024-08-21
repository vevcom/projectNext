
import ChannelSettings from './channelSettings'
import { readNotificationChannelsAction } from '@/actions/notifications/channel/read'
import { readMailAliasesAction } from '@/actions/mail/alias/read'
import { notFound } from 'next/navigation'


export default async function Channels({ params }: {
    params: {
        currentId: string
    }
}) {
    const [channels, mailAliases] = await Promise.all([
        readNotificationChannelsAction(),
        readMailAliasesAction(),
    ])

    if (!channels.success || !mailAliases.success) {
        // TODO: Handle error
        notFound()
    }

    const currentId = Number(params.currentId)
    const selected = channels.data.find(c => c.id === currentId)

    if (!selected) {
        notFound()
    }

    return <ChannelSettings channels={channels.data} currentChannel={selected} mailAliases={mailAliases.data} />
}
