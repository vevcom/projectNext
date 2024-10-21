import styles from './page.module.scss'
import CreateJobAdForm from './CreateJobAdForm'
import CurrentJobAds from './CurrentJobAds'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import CompanyPagingProvider from '@/contexts/paging/CompanyPaging'
import CompanySelectionProvider from '@/contexts/CompanySelection'

export default async function JobAds() {
    return (
        <PageWrapper title="jobbannonser"
            headerItem={
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
            }>
            <div className={styles.wrapper}>
                <CurrentJobAds/>
            </div>
        </PageWrapper>
    )
}
