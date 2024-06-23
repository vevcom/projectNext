'use client'

import UpdateSubscriptionForm from './updateSubscriptionForm'
import styles from './notificationSettingItem.module.scss'
import { allMethodsOff } from '@/server/notifications/Types'
import { v4 as uuid } from 'uuid'
import { useState } from 'react'
import type { NotificationBranch } from '../Types'

export function NotificationSettingItem({
    channel
}: {
    channel: NotificationBranch
}) {
    const methods = channel.subscription?.methods ?? allMethodsOff

    const [collapsed, setCollaped] = useState(true)

    const subSubscriptions = channel.children.reduce((acc, c) => acc + (c.subscription ? 1 : 0), 0)


    return <div className={styles.notificationSettingItem}>
        <h3>{channel.name}</h3>
        <p>{channel.description}</p>

        <UpdateSubscriptionForm channel={channel} methods={methods}/>

        { (channel.children.length > 0) && <>
            <hr className={styles.hrLine}/>
            <h4
                className={styles.subChannelHeader}
                onClick={() => setCollaped(!collapsed)}
            >Underkanaler {subSubscriptions > 0 && `(${subSubscriptions} aktive)`}</h4>

            <div className={`${styles.childrenContainer} ${collapsed ? styles.collapsed : ''}`}>
                {channel.children.map(c => <NotificationSettingItem channel={c} key={uuid()}/>)}
            </div>
        </>}
    </div>
}
