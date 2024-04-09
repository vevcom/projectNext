import styles from './page.module.scss'
import CreateJobAdForm from './CreateJobAdForm'
import CurrentJobAds from './currentJobAds'
import AddHeaderItemPopUp from '@/components/AddHeaderItem/AddHeaderItemPopUp'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { readImageAction } from '@/actions/images/read'

export default async function JobAds() {
    const testImageRes = await readImageAction('ohma')
    if (!testImageRes.success) throw new Error('Failed to read image')

    return (
        <PageWrapper title="jobbannonser"
            headerItem={<AddHeaderItemPopUp PopUpKey={'jobAdForm'}><CreateJobAdForm/></AddHeaderItemPopUp>}>
            <div className={styles.wrapper}>
                <CurrentJobAds/>

            </div>
        </PageWrapper>

    )
}
