import styles from './page.module.scss'
import CreateJobAdForm from './CreateJobAdForm'
import CurrentJobAds from './CurrentJobAds'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import ArchiveLink from '@/components/HeaderItems/ArchiveLink'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { CompanyPagingProvider } from '@/contexts/paging/CompanyPaging'
import CompanySelectionProvider from '@/contexts/CompanySelection'

export default async function JobAds() {
    return (
        <PageWrapper title="Jobbannonser"
            headerItem={
                <div className={styles.head}>
                    <AddHeaderItemPopUp popUpKey={'jobAdForm'}>
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
                    <ArchiveLink href="/career/jobads/archive" />
                </div>
            }>
            <div className={styles.wrapper}>
                <CurrentJobAds/>
            </div>
        </PageWrapper>
    )
}
