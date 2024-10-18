import { Session } from '@/auth/Session'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import SpecialCmsParagraph from '@/components/Cms/CmsParagraph/SpecialCmsParagraph'

export default async function CareerLandingPage() {
    const session = await Session.fromNextAuth()

    return (
        <PageWrapper title={session.user ? 'Karriere' : 'For bedrifter'}>
            <SpecialCmsParagraph special="CAREER_INFO" />
        </PageWrapper>
    )
}
