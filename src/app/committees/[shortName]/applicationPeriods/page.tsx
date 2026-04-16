import styles from './page.module.scss'
import { PeriodSection } from './periodTableSection'
import getCommittee from '@/app/committees/[shortName]/getCommittee'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readCommitteeParticipatingPeriodAction } from '@/services/applications/committeeParticipation/actions'

export type PropTypes = {
    params: Promise<{
        shortName: string
    }>
}


export default async function ApplicationPeriods({ params }: PropTypes) {
    const committee = await getCommittee(params)
    const shortName = (await params).shortName
    const committeePeriodes = unwrapActionReturn(
        await readCommitteeParticipatingPeriodAction({ params: { committeeId: committee.id } })
    ).sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
    if (committeePeriodes.length === 0) { return 'ingen søknadsperioder funnet' }
    return (
        <table className={styles.periodTable}>
            <thead>
                <tr className={styles.periodHeading}>
                    <th className={styles.tableEntry}>Start dato</th>
                    <th className={styles.tableEntry}>Slutt dato</th>
                    <th className={styles.tableEntry}>Omprioritering slutt dato</th>
                    <th className={styles.tableEntry}>Søknader</th>
                    <th className={styles.tableEntry}>Søknadstall</th>
                </tr>
            </thead>
            <tbody>
                {committeePeriodes.map((period, index) => (
                    <PeriodSection shortName={shortName} key={index} period={period}></PeriodSection>
                ))
                }
            </tbody>
        </table >
    )
}
