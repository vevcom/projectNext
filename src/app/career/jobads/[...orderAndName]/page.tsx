
import styles from './page.module.scss'
import EditJobAd from './EditJobAd'
import { readJobAdAction } from '@/actions/career/jobAds/read'
import Article from '@/components/Cms/Article/Article'
import { notFound } from 'next/navigation'
import CompanySelectionProvider from '@/contexts/CompanySelection'
import CompanyPagingProvider from '@/contexts/paging/CompanyPaging'
import Company from '@/components/Company/Company'
import Date from '@/components/Date/Date'
import { JobTypeConfig } from '@/services/career/jobAds/ConfigVars'

type PropTypes = {
    params: {
        orderAndName: string[]
    }
}


export default async function JobAd({ params }: PropTypes) {
    if (params.orderAndName.length !== 2) notFound()
    const order = parseInt(decodeURIComponent(params.orderAndName[0]), 10)
    const name = decodeURIComponent(params.orderAndName[1])

    const { session, ...jobAdRes } = await readJobAdAction.bind(null, ({
        idOrName: { articleName: name, order }
    }))()
    if (!jobAdRes.success) {
        if (jobAdRes.errorCode === 'NOT FOUND') notFound()
        throw new Error('Failed to read jobAd')
    }
    const jobAd = jobAdRes.data
    return (
        <div className={styles.wrapper}>
            <Article article={jobAd.article} sideBarClassName={styles.sideBar} sideBarContent={
            <>
                <Company company={jobAd.company} asClient={false} session={session} />
                {
                    jobAd.applicationDeadline ? (
                        <p>Søknadsfrist: <Date date={jobAd.applicationDeadline} /> </p>
                    ) : (
                        <p>Søknadsfrist: Ikke satt</p>
                    )

                }
                <p>Stillingstype: {JobTypeConfig[jobAd.type].label}</p>
                <p>{jobAd.active ? 'Denne jobbanonsen er aktiv': 'Denne jobbanonsen er arkivert'}</p>
            </>
            } />
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
