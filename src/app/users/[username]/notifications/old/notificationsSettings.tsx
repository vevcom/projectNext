'use server'
import { NotificationSettingItem } from './notificationSettingItem'
import styles from './notificationsSettings.module.scss'
import { readNotificationChannelsAction } from '@/actions/notifications/channel/read'
import { readSubscriptionsAction } from '@/actions/notifications/subscription/read'
import type { NotificationChannel } from '@/server/notifications/Types'
import type { Subscription } from '@/server/notifications/subscription/Types'
import type { NotificationBranch } from '../Types'

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
        readNotificationChannelsAction(),
        readSubscriptionsAction(),
    ])

    if (!channels.success || !subscriptions.success) {
        return <p>Kunne ikke laste inn varslinger</p>
    }

    const channelTree = generateChannelTree(channels.data, subscriptions.data)

    return <div className={styles.notificationsSettings}>
        <h3>Varslinger</h3>
        <p className={styles.lightParagraph}>
            Her kan du endrer hvordan du får varslinger.
            Varslingene blir sendt ut i kanaler som du kan abonnere på.
            For å få varslingen slik du selv ønsker, velger du selv hvilken metode varslet skal bruke (e-post, push osv.)
            Kanalene er oragnisert slik at en kanal kan ha underkanaler, videre kalt barn.
            Det er disse du kan se når du åpner en kanal.
            Dersom det blir lagt til nye kanaler vil du da abbonere med metodene som er aktive i både
            foreldrekanalen du abbonerer på og de standarde metodene til den nye kanalen.
            Det er også verdt å legge merke til at du kan abbonere på barna til en kanal,
            uten å abbonere på foreldre-kanalen.
        </p>
        <NotificationSettingItem channel={channelTree} />
    </div>
}
