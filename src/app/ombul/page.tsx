import PageWrapper from '../components/PageWrapper/PageWrapper';
import styles from './page.module.scss';
import AddHeaderItemPopUp from '../components/AddHeaderItem/AddHeaderItemPopUp';
import CreateOmbul from './CreateOmbul';
import { readLatestOmbul } from '@/actions/ombul/read';

export default async function page() {
    const latestOmbulRes = await readLatestOmbul()
    const latestOmbul = latestOmbulRes.success ? latestOmbulRes.data : null
    console.log(latestOmbul)

    return (
        <PageWrapper
            title="Ombul"
            headerItem={
                <AddHeaderItemPopUp PopUpKey="create ombul">
                    <CreateOmbul latestOmbul={latestOmbul} />
                </AddHeaderItemPopUp>
            }
        >
            <div className={styles.wrapper}>
                hei
            </div>
        </PageWrapper>
    )
}
