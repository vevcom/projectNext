import MailForm from './mailForm'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { getUser } from '@/auth/getUser'
import { notFound } from 'next/navigation'
import { readMailAliasesAction } from '@/actions/mail/alias/read'

export default async function SendMail() {
    // TODO: permission checks
    const { authorized } = await getUser({
        requiredPermissions: [['MAIL_SEND']],
    })

    const mailAliases = await readMailAliasesAction()

    if (!authorized || !mailAliases.success) {
        notFound()
    }

    return (
        <PageWrapper title="Elektronisk postutsendelse">
            <MailForm aliases={mailAliases.data} />
        </PageWrapper>
    )
}
