'use client'

import UpdateSubscriptionForm from './updateSubscriptionForm'
import { allMethodsOff } from '@/server/notifications/Types'
import { v4 as uuid } from 'uuid'
import type { NotificationBranch } from './Types'

export function NotificationSettingItem({
    channel
}: {
    channel: NotificationBranch
}) {
    const methods = channel.subscription?.methods ?? allMethodsOff


    return <div>
        <h4>{channel.name}</h4>
        <p>{channel.description}</p>

        <UpdateSubscriptionForm channel={channel} methods={methods}/>

        <div style={{ paddingLeft: '2rem' }}>
            {channel.children.map(c => <NotificationSettingItem channel={c} key={uuid()}/>)}
        </div>
    </div>
}
