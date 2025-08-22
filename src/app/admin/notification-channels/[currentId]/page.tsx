
import ChannelSettings from './channelSettings'
import { readNotificationChannelsAction } from '@/actions/notifications'
import { readMailAliasesAction } from '@/actions/mail/alias/read'
import { notFound } from 'next/navigation'

type PropTypes = {
    params: Promise<{
        currentId: string
    }>
}

export default async function Channels({ params }: PropTypes) {
    const [channels, mailAliases] = await Promise.all([
        readNotificationChannelsAction(),
        readMailAliasesAction(),
    ])

    if (!channels.success || !mailAliases.success) {
        // TODO: Handle error
        notFound()
    }

    const currentId = Number((await params).currentId)
    const selected = channels.data.find(channel => channel.id === currentId)

    if (!selected) {
        notFound()
    }

    return <ChannelSettings channels={channels.data} currentChannel={selected} mailAliases={mailAliases.data} />
}
