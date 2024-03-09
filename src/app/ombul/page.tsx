import styles from './page.module.scss'
import CreateOmbul from './CreateOmbul'
import OmbulCover from './OmbulCover'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import AddHeaderItemPopUp from '@/components/AddHeaderItem/AddHeaderItemPopUp'
import { readLatestOmbul, readOmbuls } from '@/actions/ombul/read'
import { getUser } from '@/auth'
import type { ExpandedOmbul } from '@/actions/ombul/Types'

export default async function Ombuls() {
    const { user } = await getUser({
        requiredPermissions: ['OMBUL_READ'],
        required: true,
    })

    const showCreateButton = user.permissions.includes('OMBUL_CREATE')

    const latestOmbulRes = await readLatestOmbul()
    const latestOmbul = latestOmbulRes.success ? latestOmbulRes.data : null
    const ombulRes = await readOmbuls()
    if (!ombulRes.success) throw new Error('Failed to read ombuls')
    const ombuls = ombulRes.data

    const yearsWithOmbul = Object.entries(ombuls.reduce((groups, ombul) => {
        const year = ombul.year
        if (!groups[year]) {
            groups[year] = []
        }
        groups[year].push(ombul)
        return groups
    }, {} as { [year: number]: ExpandedOmbul[] })).toSorted(([a], [b]) => parseInt(b, 10) - parseInt(a, 10))

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
                    yearsWithOmbul.map(([year, ombulsInYear]) => (
                        <div key={year}>
                            <h1>{year}</h1>
                            <div className={styles.ombulList}>
                                {
                                    ombulsInYear.map(ombul => (
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
