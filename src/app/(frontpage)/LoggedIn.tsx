import styles from './page.module.scss'
import loggedInStyles from './LoggedIn.module.scss'
import LoggedInSection from './LoggedInSection'
import EventCard from '@/app/_components/Event/EventCard'
import JobAd from '@/app/career/jobads/JobAd'
import NewsCard from '@/app/news/NewsCard'
import StandardImageServer from '@/components/Image/StandardImageServer'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readNewsCurrentAction } from '@/services/news/actions'
import { readActiveJobAdsAction } from '@/services/career/jobAds/actions'
import { readCurrentEventsAction } from '@/services/events/actions'
import { eventAuth } from '@/services/events/auth'
import { frontpageAuth } from '@/services/frontpage/auth'
import { ServerSession } from '@/auth/session/ServerSession'
import Footer from '@/components/Footer/Footer'
import PageTitleSetter from '@/contexts/PageTitleSetter'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

export default async function LoggedInLandingPage() {
    const MAX_NUMBER_OF_ELEMENTS = 3
    const news = unwrapActionReturn(await readNewsCurrentAction())
        .slice(0, MAX_NUMBER_OF_ELEMENTS)
    const jobAds = unwrapActionReturn(await readActiveJobAdsAction())
        .slice(0, MAX_NUMBER_OF_ELEMENTS)
    const events = unwrapActionReturn(await readCurrentEventsAction({ params: { tags: null } }))
        .slice(0, MAX_NUMBER_OF_ELEMENTS)

    const session = await ServerSession.fromNextAuth()

    const canEditEventCmsImage = eventAuth.updateCmsCoverImage.dynamicFields({}).auth(
        session
    ).toJsObject()

    const canEditSpecialCmsImage = frontpageAuth.updateSpecialCmsImage.dynamicFields({}).auth(
        await ServerSession.fromNextAuth()
    ).toJsObject()

    return (
        <div className={styles.wrapper}>
            <PageTitleSetter title={'Sct. Omega'} />
            <div className={`${styles.part} ${styles.frontImg}`}>
                <div className={styles.frontInfo}>
                    <div>
                        <StandardImageServer
                            standardImage="LOGO_WHITE"
                            width={300}
                        />
                        <Link className={styles.scrollDown} href="#firstSection">
                            <FontAwesomeIcon icon={faAngleDown} />
                        </Link>
                    </div>
                </div>
            </div>
            <div id="firstSection" className={`${styles.part} ${loggedInStyles.loggedInPart}`}>
                <div>
                    <div className={loggedInStyles.islands}>
                        <LoggedInSection title="Nyheter" link="/news">
                            {news.map((newsArticle, key) => (
                                <NewsCard key={key} news={newsArticle} />
                            ))}
                        </LoggedInSection>
                        <LoggedInSection title="Hvad der hender" link="/events" layout="rows" span="half">
                            {events.map((event, key) => (
                                <EventCard key={key} event={event} canEdit={canEditEventCmsImage} />
                            ))}
                        </LoggedInSection>
                        <LoggedInSection title="Jobbannonser" link="/career/jobads" layout="rows" span="half">
                            {jobAds.map((jobAd, key) => (
                                <JobAd key={key} jobAd={jobAd} />
                            ))}
                        </LoggedInSection>
                        <LoggedInSection title="Bilder" link="/image-collections">
                            Her kan man kanskje vise noen bilder ellerno
                        </LoggedInSection>
                    </div>
                </div>
            </div>
            <div className={styles.footer}>
                <Footer canEditSpecialCmsImage={canEditSpecialCmsImage} />
            </div>
        </div>
    )
}
