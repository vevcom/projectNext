import styles from './page.module.scss'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import ImageCard from '@/components/ImageCard/ImageCard'
import { readImageAction } from '@/actions/images/read'
import AddHeaderItemPopUp from '../components/AddHeaderItem/AddHeaderItemPopUp'
import CreateJobAdForm from './CreateJobAdForm'
import CurrentJobAds from './currentJobAds'

export default async function JobAds() {
    const testImageRes = await readImageAction('ohma')
    if (!testImageRes.success) throw new Error('Failed to read image')
    const testImage = testImageRes.data

    return (
        <PageWrapper title="jobbannonser" 
        headerItem={<AddHeaderItemPopUp PopUpKey={"jobAdForm"}><CreateJobAdForm/></AddHeaderItemPopUp>}>
            <div className={styles.wrapper}>
                <CurrentJobAds/>

            </div>
        </PageWrapper>

    )
}
