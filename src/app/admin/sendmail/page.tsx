import PageWrapper from "@/components/PageWrapper/PageWrapper"
import { getUser } from '@/auth/getUser'
import { notFound } from "next/navigation"
import MailForm from "./mailForm"

export default async function SendMail() {

    // TODO: permission checks
    const { authorized } = await getUser({
        requiredPermissions: [['MAIL_SEND']],
    })

    if (!authorized) {
        notFound();
    }

    return (
        <PageWrapper title="Elektronisk postutsendelse">
            <MailForm />
        </PageWrapper>
    )
}