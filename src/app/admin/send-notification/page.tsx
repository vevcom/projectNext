'use server'
import NotificaionForm from './notificationForm'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { readNotificationChannelsAction } from '@/services/notifications/actions'
import { notificationAuth } from '@/services/notifications/auth'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { ServerSession } from '@/auth/session/ServerSession'


export default async function SendNotification() {
    notificationAuth.create.dynamicFields({}).auth(
        await ServerSession.fromNextAuth()
    ).redirectOnUnauthorized({ returnUrl: '/admin/send-notification' })

    const channels = unwrapActionReturn(await readNotificationChannelsAction())

    return <PageWrapper
        title="Send Varsel"
    >
        <NotificaionForm channels={channels}/>
    </PageWrapper>
}
