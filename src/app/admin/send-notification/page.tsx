'use server'
import NotificaionForm from './notificationForm'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { readNotificationChannelsAction } from '@/services/notifications/actions'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'


export default async function SendNotification() {
    const channels = unwrapActionReturn(await readNotificationChannelsAction())

    return <PageWrapper
        title="Send Varsel"
    >
        <NotificaionForm channels={channels}/>
    </PageWrapper>
}
