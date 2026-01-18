'use server'

import AddNotificationChannel from './addNotificationChannel'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { readNotificationChannelsAction } from '@/services/notifications/actions'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import Link from 'next/link'
import { v4 as uuid } from 'uuid'

export default async function NotificationChannels() {
    const channels = unwrapActionReturn(await readNotificationChannelsAction())

    return <PageWrapper
        title="Varslingskanaler"
        headerItem={
            <AddHeaderItemPopUp popUpKey="createNewsPop">
                <AddNotificationChannel channels={channels}/>
            </AddHeaderItemPopUp>
        }
    >
        <ul>
            {channels.map(channel =>
                <li key={uuid()}>
                    <Link href={`/admin/notification-channels/${channel.id}`}>{channel.name}</Link>
                </li>
            )}
        </ul>
    </PageWrapper>
}
