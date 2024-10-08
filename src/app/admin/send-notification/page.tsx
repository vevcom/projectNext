'use server'
import NotificaionForm from './notificationForm'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { ServerError } from '@/services/error'
import { readNotificationChannelsAction } from '@/actions/notifications/channel/read'


export default async function SendNotification() {
    const channels = await readNotificationChannelsAction()

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
