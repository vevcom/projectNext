'use server'

import AddNotificationChannel from './addNotificationChannel'
import { AddHeaderItemPopUp } from '@/app/components/HeaderItems/HeaderItemPopUp'
import PageWrapper from '@/app/components/PageWrapper/PageWrapper'
import { readNotificationChannelsAction } from '@/actions/notifications/channel/read'
import { ServerError } from '@/server/error'
import Link from 'next/link'
import { v4 as uuid } from 'uuid'

export default async function () {
    const channels = await readNotificationChannelsAction()

    if (!channels.success) {
        console.error(channels)
        throw new ServerError('UNKNOWN ERROR', 'Could not read notification channels')
    }

    return <PageWrapper
        title="Varslingskanaler"
        headerItem={
            <AddHeaderItemPopUp PopUpKey="createNewsPop">
                <AddNotificationChannel channels={channels.data}/>
            </AddHeaderItemPopUp>
        }
    >
        <ul>
            {channels.data.map(c =>
                <li key={uuid()}>
                    <Link href={`/admin/notification-channels/${c.id}`}>{c.name}</Link>
                </li>
            )}
        </ul>
    </PageWrapper>
}
