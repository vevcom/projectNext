import styles from './page.module.scss'
import loggedInStyles from './LoggedIn.module.scss'
import LoggedInSection from './LoggedInSection'
import EventCard from '@/app/_components/Event/EventCard'
import JobAd from '@/app/career/jobads/JobAd'
import NewsCard from '@/app/news/NewsCard'
import SocialIcons from '@/components/SocialIcons/SocialIcons'
import SpecialCmsImage from '@/components/Cms/CmsImage/SpecialCmsImage'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readNewsCurrentAction } from '@/actions/news/read'
import { readActiveJobAdsAction } from '@/actions/career/jobAds/read'
import { readCurrentEventsAction } from '@/actions/events/read'
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

    return (
        <div className={styles.wrapper}>
            <div className={`${styles.part} ${styles.frontImg}`}>
                <div className={styles.frontInfo}>
                    <div>
                        <SpecialCmsImage special="FRONTPAGE_LOGO" width={300} />
                        <div className={styles.socials}>
                            <SocialIcons />
                        </div>
                        <Link className={styles.scrollDown} href="#firstSection">
                            <FontAwesomeIcon icon={faAngleDown} />
                        </Link>
                    </div>
                </div>
            </div>
            <div className={`${styles.part} ${loggedInStyles.loggedInPart}`}>
                <div>
                    <LoggedInSection title="Nyheter" link="/news">
                        {news.map((newsArticle, key) => (
                            <NewsCard key={key} news={newsArticle} />
                        ))}
                    </LoggedInSection>
                    <LoggedInSection title="Hvad der hender" link="/events">
                        {events.map((event, key) => (
                            <EventCard key={key} event={event} />
                        ))}
                    </LoggedInSection>
                    <LoggedInSection title="Jobb annonser" link="/career/jobads">
                        {jobAds.map((jobAd, key) => (
                            <JobAd key={key} jobAd={jobAd} />
                        ))}
                    </LoggedInSection>
                    <LoggedInSection title="Bilder" link="/images">
                        Her kan man kanskje vise noen bilder ellerno
                    </LoggedInSection>
                </div>
            </div>
        </div>
    )
}
