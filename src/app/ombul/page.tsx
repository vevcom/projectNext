import PageWrapper from '../components/PageWrapper/PageWrapper';
import styles from './page.module.scss';
import AddHeaderItemPopUp from '../components/AddHeaderItem/AddHeaderItemPopUp';
import CreateOmbul from './CreateOmbul';
import { readLatestOmbul, readOmbuls } from '@/actions/ombul/read';
import OmbulCover from './OmbulCover';

export default async function page() {
    const latestOmbulRes = await readLatestOmbul()
    const latestOmbul = latestOmbulRes.success ? latestOmbulRes.data : null
    const ombulRes = await readOmbuls()
    if (!ombulRes.success) throw new Error('Failed to read ombuls')
    const ombuls = ombulRes.data

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
            {
                ombuls.map(ombul => (
                    <OmbulCover key={ombul.id} ombul={ombul} />
                ))
            }
            </div>
        </PageWrapper>
    )
}
