import { NotificationSettingItem } from './notificationSettingItem'
import { readAllNotificationChannelsAction } from '@/actions/notifications/channel/read'
import { readMySubscriptionsAction } from '@/actions/notifications/subscription/read'
import type { NotificationChannel } from '@/server/notifications/Types'
import type { Subscription } from '@/server/notifications/subscription/Types'
import type { NotificationBranch } from './Types'

function generateChannelTree(channels: NotificationChannel[], subscriptions: Subscription[]): NotificationBranch {
    const rootChannel = channels.find(c => c.special === 'ROOT')
    if (!rootChannel) {
        throw Error('Ingen ROOT varslings kanal')
    }

    function extendChannel(channel: NotificationChannel): NotificationBranch {
        return {
            ...channel,
            children: [],
            subscription: subscriptions.find(s => s.channelId === channel.id)
        }
    }


    const channelTree = extendChannel(rootChannel)

    function searchTree(currentBranch: NotificationBranch) {
        for (let i = 0; i < channels.length; i++) {
            if (channels[i].parentId === currentBranch.id && channels[i].special !== 'ROOT') {
                const obj = extendChannel(channels[i])
                currentBranch.children.push(obj)
                searchTree(obj)
            }
        }
    }

    searchTree(channelTree)

    return channelTree
}

export async function NotificationSettings() {
    const [channels, subscriptions] = await Promise.all([
        readAllNotificationChannelsAction(),
        readMySubscriptionsAction(),
    ])

    if (!channels.success || !subscriptions.success) {
        return <p>Kunne ikke laste inn varslinger</p>
    }

    const channelTree = generateChannelTree(channels.data, subscriptions.data)

    return <div>
        <h3>Varslinger</h3>
        <NotificationSettingItem channel={channelTree} />
    </div>
}
