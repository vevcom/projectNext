import styles from './page.module.scss'
import CreateJobAdForm from './CreateJobAdForm'
import CurrentJobAds from './currentJobAds'
import AddHeaderItemPopUp from '@/components/AddHeaderItem/AddHeaderItemPopUp'
import PageWrapper from '@/components/PageWrapper/PageWrapper'

export default async function JobAds() {
    return (
        <PageWrapper title="jobbannonser"
            headerItem={<AddHeaderItemPopUp PopUpKey={'jobAdForm'}><CreateJobAdForm/></AddHeaderItemPopUp>}>
            <div className={styles.wrapper}>
                <CurrentJobAds/>
            </div>
        </PageWrapper>
    )
}
