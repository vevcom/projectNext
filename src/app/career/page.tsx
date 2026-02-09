import styles from './page.module.scss'
import SpecialCmsParagraph from '@/components/Cms/CmsParagraph/SpecialCmsParagraph'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { ServerSession } from '@/auth/session/ServerSession'
import Image from '@/components/Image/Image'
import CmsLink from '@/components/Cms/CmsLink/CmsLink'
import { QueryParams } from '@/lib/queryParams/queryParams'
import { readSpecialImageAction } from '@/services/images/actions'
import { readSpecialEventTagAction } from '@/services/events/tags/actions'
import {
    readSpecialCmsParagraphCareerInfo,
    updateSpecialCmsParagraphContentCareerInfo,
    readCareerSpecialCmsLinkAction,
    updateCareerSpecialCmsLinkAction
} from '@/services/career/actions'
import { careerAuth } from '@/services/career/auth'
import Link from 'next/link'

export default async function CareerLandingPage() {
    const session = await ServerSession.fromNextAuth()
    const jobAdImageRes = await readSpecialImageAction({ params: { special: 'MACHINE' } })
    const eventImageRes = await readSpecialImageAction({ params: { special: 'FAIR' } })
    const comanyImageRes = await readSpecialImageAction({ params: { special: 'REALFAGSBYGGET' } })
    const conactorCmsLinkRes = await readCareerSpecialCmsLinkAction({ params: { special: 'CAREER_LINK_TO_CONTACTOR' } })
    const companyPresentationEventTagRes = await readSpecialEventTagAction({ params: { special: 'COMPANY_PRESENTATION' } })

    const jobAdImage = jobAdImageRes.success ? jobAdImageRes.data : null
    const eventImage = eventImageRes.success ? eventImageRes.data : null
    const companyImage = comanyImageRes.success ? comanyImageRes.data : null
    const contactorCmsLink = conactorCmsLinkRes.success ? conactorCmsLinkRes.data : null
    const companyPresentationEventTag = companyPresentationEventTagRes.success ? companyPresentationEventTagRes.data : null

    const canEditSpecialCmsLink = careerAuth.updateSpecialCmsLink.dynamicFields({}).auth(
        session
    ).toJsObject()
    const canEditSpecialCmsParagraph = careerAuth.updateSpecialCmsParagraphContentCareerInfo.dynamicFields({}).auth(
        session
    ).toJsObject()

    return (
        <PageWrapper title={session.user ? 'Karriere' : 'For bedrifter'} headerItem={
            contactorCmsLink ? <CmsLink
                canEdit={canEditSpecialCmsLink}
                className={styles.conactorLink}
                cmsLink={contactorCmsLink}
                updateCmsLinkAction={updateCareerSpecialCmsLinkAction}
            /> : <></>
        }>
            <div className={styles.wrapper}>
                <SpecialCmsParagraph
                    canEdit={canEditSpecialCmsParagraph}
                    className={styles.info}
                    special="CAREER_INFO"
                    readSpecialCmsParagraphAction={readSpecialCmsParagraphCareerInfo}
                    updateCmsParagraphAction={updateSpecialCmsParagraphContentCareerInfo}
                />
                <span className={styles.links}>
                    <Link href="/career/jobads">
                        { jobAdImage ? <Image
                            disableLinkingToLicense
                            imageContainerClassName={styles.linkImage}
                            width={300} image={jobAdImage} /> : <></> }
                        <h2>Jobbanonser</h2>
                    </Link>
                    <Link href={`/events?${QueryParams.eventTags.encodeUrl(
                        companyPresentationEventTag ? [companyPresentationEventTag.name] : []
                    )}`}>
                        { eventImage ? <Image
                            disableLinkingToLicense
                            imageContainerClassName={styles.linkImage}
                            width={300} image={eventImage} /> : <></> }
                        <h2>Bedriftpresentasjoner</h2>
                    </Link>
                    <Link href="/career/companies">
                        { companyImage ? <Image
                            disableLinkingToLicense
                            imageContainerClassName={styles.linkImage}
                            width={300} image={companyImage} /> : <></> }
                        <h2>Bedrifter</h2>
                    </Link>
                </span>
            </div>
        </PageWrapper>
    )
}
