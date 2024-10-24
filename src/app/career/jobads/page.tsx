import styles from './page.module.scss'
import CreateJobAdForm from './CreateJobAdForm'
import CurrentJobAds from './CurrentJobAds'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import CompanyPagingProvider from '@/contexts/paging/CompanyPaging'
import CompanySelectionProvider from '@/contexts/CompanySelection'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArchive } from '@fortawesome/free-solid-svg-icons'

export default async function JobAds() {
    return (
        <PageWrapper title="jobbannonser"
            headerItem={
                <>
                    <AddHeaderItemPopUp PopUpKey={'jobAdForm'}>
                        <CompanyPagingProvider
                            serverRenderedData={[]}
                            startPage={{
                                page: 0,
                                pageSize: 10
                            }}
                            details={{ name: undefined }}
                        >
                            <CompanySelectionProvider company={null}>
                                <CreateJobAdForm/>
                            </CompanySelectionProvider>
                        </CompanyPagingProvider>
                    </AddHeaderItemPopUp>
                    <Link href="/career/jobads/archive" className={styles.archiveLink} >
                        <FontAwesomeIcon icon={faArchive} />
                    </Link>
                </>
            }>
            <div className={styles.wrapper}>
                <CurrentJobAds/>
            </div>
        </PageWrapper>
    )
}
