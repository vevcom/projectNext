
import styles from './page.module.scss'
import EditJobAd from './EditJobAd'
import { readJobAdAction } from '@/actions/career/jobAds/read'
import Article from '@/components/Cms/Article/Article'
import CompanySelectionProvider from '@/contexts/CompanySelection'
import CompanyPagingProvider from '@/contexts/paging/CompanyPaging'
import Company from '@/components/Company/Company'
import Date from '@/components/Date/Date'
import { Session } from '@/auth/Session'
import { JobAdConfig } from '@/services/career/jobAds/config'
import { notFound } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCheckCircle,
    faClock,
    faLocationDot,
    faNewspaper,
    faSuitcase,
    faXmarkCircle
} from '@fortawesome/free-solid-svg-icons'

type PropTypes = {
    params: Promise<{
        orderAndName: string[]
    }>
}


export default async function JobAd({ params }: PropTypes) {
    if ((await params).orderAndName.length !== 2) notFound()
    const order = parseInt(decodeURIComponent((await params).orderAndName[0]), 10)
    const name = decodeURIComponent((await params).orderAndName[1])
    const session = await Session.fromNextAuth()
    const jobAdRes = await readJobAdAction({ idOrName: { articleName: name, order } })
    if (!jobAdRes.success) {
        //TODO: Handle error in idiomatic way
        if (jobAdRes.errorCode === 'NOT FOUND') notFound()
        throw new Error('Failed to read jobAd')
    }
    const jobAd = jobAdRes.data
    return (
        <div className={styles.wrapper}>
            <main>
                <Article article={jobAd.article} sideBarClassName={styles.sideBar} sideBarContent={
                    <>
                        <ul className={styles.metInfo}>
                            <li>
                                <FontAwesomeIcon icon={faSuitcase} />
                                <h3>Stillingstype</h3>
                                <p>{JobAdConfig.type[jobAd.type].label}</p>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={jobAd.active ? faCheckCircle : faXmarkCircle} />
                                <h3>Status</h3>
                                <p>{jobAd.active ? 'Denne jobbanonsen er aktiv' : 'Denne jobbanonsen er arkivert'}</p>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faClock} />
                                <h3>Søknadsfrist</h3>
                                <p>
                                    { jobAd.applicationDeadline ?
                                        <Date date={jobAd.applicationDeadline} /> :
                                        'Ingen søknadsfrist satt'
                                    }
                                </p>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faNewspaper} />
                                <h3>Publisert</h3>
                                <p>
                                    <Date date={jobAd.createdAt} />
                                </p>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faLocationDot} />
                                <h3>Sted</h3>
                                <p>{jobAd.location}</p>
                            </li>
                        </ul>
                        <div className={styles.company}>
                            <h2>Arbeidsgiver</h2>
                            <Company
                                disableEdit
                                squareLogo={false}
                                company={jobAd.company}
                                asClient={false}
                                session={session}
                            />
                        </div>
                    </>
                } />
            </main>
            <CompanyPagingProvider
                serverRenderedData={[]}
                startPage={{
                    page: 0,
                    pageSize: 10
                }}
                details={{ name: undefined }}
            >
                <CompanySelectionProvider company={jobAd.company}>
                    <EditJobAd jobAd={jobAd}/>
                </CompanySelectionProvider>
            </CompanyPagingProvider>
        </div>

    )
}
