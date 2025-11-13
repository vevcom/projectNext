import styles from './page.module.scss'
import EditJobAd from './EditJobAd'
import Article from '@/components/Cms/Article/Article'
import CompanySelectionProvider from '@/contexts/CompanySelection'
import { CompanyPagingProvider } from '@/contexts/paging/CompanyPaging'
import Company from '@/components/Company/Company'
import Date from '@/components/Date/Date'
import { Session } from '@/auth/session/Session'
import {
    readJobAdAction,
    updateJobAdArticleAction,
    updateJobAdArticleAddSectionAction,
    updateJobAdArticleCmsImageAction,
    updateJobAdArticleCmsLinkAction,
    updateJobAdArticleCmsParagraphAction,
    updateJobAdArticleCoverImageAction,
    updateJobAdArticleReorderSectionsAction,
    updateJobAdArticleSectionAction,
    updateJobAdArticleSectionsAddPartAction,
    updateJobAdArticleSectionsRemovePartAction
} from '@/services/career/jobAds/actions'
import { jobAdType } from '@/services/career/jobAds/constants'
import { decodeVevenUriHandleError } from '@/lib/urlEncoding'
import { configureAction } from '@/services/configureAction'
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
        nameAndId: string
    }>
}

export default async function JobAd({ params }: PropTypes) {
    const nameAndId = (await params).nameAndId

    const session = await Session.fromNextAuth()
    const jobAdRes = await readJobAdAction({ params: { id: decodeVevenUriHandleError(nameAndId) } })
    if (!jobAdRes.success) {
        //TODO: Handle error in idiomatic way
        if (jobAdRes.errorCode === 'NOT FOUND') notFound()
        throw new Error('Failed to read jobAd')
    }
    const jobAd = jobAdRes.data
    return (
        <div className={styles.wrapper}>
            <main>
                <Article
                    article={jobAd.article}
                    sideBarClassName={styles.sideBar}
                    actions={{
                        updateArticleAction: configureAction(
                            updateJobAdArticleAction,
                            { implementationParams: { jobAdId: jobAd.id } }
                        ),
                        updateCoverImageAction: configureAction(
                            updateJobAdArticleCoverImageAction,
                            { implementationParams: { jobAdId: jobAd.id } }
                        ),
                        addSectionToArticleAction: configureAction(
                            updateJobAdArticleAddSectionAction,
                            { implementationParams: { jobAdId: jobAd.id } }
                        ),
                        reorderArticleSectionsAction: configureAction(
                            updateJobAdArticleReorderSectionsAction,
                            { implementationParams: { jobAdId: jobAd.id } }
                        ),
                        articleSections: {
                            updateCmsParagraph: configureAction(
                                updateJobAdArticleCmsParagraphAction,
                                { implementationParams: { jobAdId: jobAd.id } }
                            ),
                            updateCmsImage: configureAction(
                                updateJobAdArticleCmsImageAction,
                                { implementationParams: { jobAdId: jobAd.id } }
                            ),
                            updateCmsLink: configureAction(
                                updateJobAdArticleCmsLinkAction,
                                { implementationParams: { jobAdId: jobAd.id } }
                            ),
                            updateArticleSection: configureAction(
                                updateJobAdArticleSectionAction,
                                { implementationParams: { jobAdId: jobAd.id } }
                            ),
                            addPartToArticleSection: configureAction(
                                updateJobAdArticleSectionsAddPartAction,
                                { implementationParams: { jobAdId: jobAd.id } }
                            ),
                            removePartFromArticleSection: configureAction(
                                updateJobAdArticleSectionsRemovePartAction,
                                { implementationParams: { jobAdId: jobAd.id } }
                            )
                        }
                    }}
                    sideBarContent={
                        <>
                            <ul className={styles.metInfo}>
                                <li>
                                    <FontAwesomeIcon icon={faSuitcase} />
                                    <h3>Stillingstype</h3>
                                    <p>{jobAdType[jobAd.type].label}</p>
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
