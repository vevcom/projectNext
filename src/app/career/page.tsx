import styles from './page.module.scss'
import SpecialCmsParagraph from '@/components/Cms/CmsParagraph/SpecialCmsParagraph'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { Session } from '@/auth/Session'
import Image from '@/components/Image/Image'
import { readSpecialImageAction } from '@/actions/images/read'
import { readSpecialCmsLinkAction } from '@/actions/cms/links/read'
import CmsLink from '@/components/Cms/CmsLink/CmsLink'
import { readSpecialEventTagAction } from '@/actions/events/tags/read'
import { QueryParams } from '@/lib/query-params/queryParams'
import { bindParams } from '@/actions/bindParams'
import Link from 'next/link'

export default async function CareerLandingPage() {
    const session = await Session.fromNextAuth()
    const jobAdImageRes = await readSpecialImageAction('ENGINEER')
    const eventImageRes = await readSpecialImageAction('FAIR')
    const comanyImageRes = await readSpecialImageAction('SKYSCRAPER')
    const conactorCmsLinkRes = await bindParams(readSpecialCmsLinkAction, { special: 'CAREER_LINK_TO_CONTACTOR' })()
    const companyPresentationEventTagRes = await bindParams(readSpecialEventTagAction, { special: 'COMPANY_PRESENTATION' })()

    const jobAdImage = jobAdImageRes.success ? jobAdImageRes.data : null
    const eventImage = eventImageRes.success ? eventImageRes.data : null
    const companyImage = comanyImageRes.success ? comanyImageRes.data : null
    const contactorCmsLink = conactorCmsLinkRes.success ? conactorCmsLinkRes.data : null
    const companyPresentationEventTag = companyPresentationEventTagRes.success ? companyPresentationEventTagRes.data : null

    return (
        <PageWrapper title={session.user ? 'Karriere' : 'For bedrifter'} headerItem={
            contactorCmsLink ? <CmsLink
                className={styles.conactorLink} cmsLink={contactorCmsLink} /> : <></>
        }>
            <div className={styles.wrapper}>
                <SpecialCmsParagraph className={styles.info} special="CAREER_INFO" />
                <span className={styles.links}>
                    <Link href="/career/jobads">
                        { jobAdImage ? <Image
                            imageContainerClassName={styles.linkImage}
                            width={300} image={jobAdImage} /> : <></> }
                        <h2>Jobbanonser</h2>
                    </Link>
                    <Link href={`/events?${QueryParams.eventTags.encodeUrl(
                        companyPresentationEventTag ? [companyPresentationEventTag.name] : []
                    )}`}>
                        { eventImage ? <Image
                            imageContainerClassName={styles.linkImage}
                            width={300} image={eventImage} /> : <></> }
                        <h2>Bedriftpresentasjoner</h2>
                    </Link>
                    <Link href="/career/companies">
                        { companyImage ? <Image
                            imageContainerClassName={styles.linkImage}
                            width={300} image={companyImage} /> : <></> }
                        <h2>Bedrifter</h2>
                    </Link>
                </span>
            </div>
        </PageWrapper>
    )
}
