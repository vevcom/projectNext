'use server'

import AddNotificationChannel from './addNotificationChannel'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { readNotificationChannelsAction } from '@/actions/notifications'
import Link from 'next/link'
import { v4 as uuid } from 'uuid'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'

export default async function NotificationChannels() {
    const channels = unwrapActionReturn(await readNotificationChannelsAction())

    return <PageWrapper
        title="Varslingskanaler"
        headerItem={
            <AddHeaderItemPopUp PopUpKey="createNewsPop">
                <AddNotificationChannel channels={channels}/>
            </AddHeaderItemPopUp>
        }
    >
        <ul>
            {channels.map(c =>
                <li key={uuid()}>
                    <Link href={`/admin/notification-channels/${c.id}`}>{c.name}</Link>
                </li>
            )}
        </ul>
    </PageWrapper>
}
