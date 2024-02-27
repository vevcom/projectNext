import PageWrapper from '../components/PageWrapper/PageWrapper';
import styles from './page.module.scss';
import AddHeaderItemPopUp from '../components/AddHeaderItem/AddHeaderItemPopUp';
import CreateOmbul from './CreateOmbul';
import { readLatestOmbul, readOmbuls } from '@/actions/ombul/read';
import OmbulCover from './OmbulCover';
import { requireUser } from '@/auth';
import type { ExpandedOmbul } from '@/actions/ombul/Types';

export default async function page() {
    const user = await requireUser({
        permissions: ['OMBUL_READ']
    })

    const showCreateButton = user.permissions.includes('OMBUL_CREATE')

    const latestOmbulRes = await readLatestOmbul()
    const latestOmbul = latestOmbulRes.success ? latestOmbulRes.data : null
    const ombulRes = await readOmbuls()
    if (!ombulRes.success) throw new Error('Failed to read ombuls')
    const ombuls = ombulRes.data

    const yearsWithOmbul = Object.entries(ombuls.reduce((groups, ombul) => {
        const year = ombul.year;
        if (!groups[year]) {
          groups[year] = [];
        }
        groups[year].push(ombul);
        return groups;
      }, {} as { [year: number]: ExpandedOmbul[] }))

    return (
        <PageWrapper
            title="Ombul"
            headerItem={
                showCreateButton && (
                    <AddHeaderItemPopUp PopUpKey="create ombul">
                        <CreateOmbul latestOmbul={latestOmbul} />
                    </AddHeaderItemPopUp>
                )
            }
        >
            <div className={styles.wrapper}>
            {
                yearsWithOmbul.map(([year, ombuls]) => (
                    <div key={year}>
                        <h1>{year}</h1>
                        <div className={styles.ombulList}>
                            {
                                ombuls.map(ombul => (
                                    <OmbulCover key={ombul.id} ombul={ombul} />
                                ))
                            }
                        </div>
                    </div>
                ))
            }
            </div>
        </PageWrapper>
    )
}
