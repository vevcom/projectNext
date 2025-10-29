import MailForm from './mailForm'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { notificationAuth } from '@/services/notifications/auth'
import { Session } from '@/auth/session/Session'

export default async function SendMail() {
    notificationAuth.sendMail.dynamicFields({}).auth(
        await Session.fromNextAuth()
    ).redirectOnUnauthorized({ returnUrl: '/admin/send-mail' })

    return (
        <PageWrapper title="Elektronisk postutsendelse">
            <MailForm />
        </PageWrapper>
    )
}
