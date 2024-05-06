'use server'
import NotificaionForm from './notificationForm'
import PageWrapper from '@/app/components/PageWrapper/PageWrapper'
import { ServerError } from '@/server/error'
import { readAllNotificationChannelsAction } from '@/actions/notifications/channel/read'


export default async function SendNotification() {
    const channels = await readAllNotificationChannelsAction()

    if (!channels.success) {
        console.error(channels)
        throw new ServerError('UNKNOWN ERROR', 'Failed to load notificaionChannels')
    }

    return <PageWrapper
        title="Send Varsel"
    >
        <NotificaionForm channels={channels.data}/>
    </PageWrapper>
}
