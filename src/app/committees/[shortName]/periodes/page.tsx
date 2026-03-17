import styles from './page.module.scss'
import getCommittee from '@/app/committees/[shortName]/getCommittee'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readCommitteeParticipatingPeriodAction } from '@/services/applications/committeeParticipation/actions'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink } from '@fortawesome/free-solid-svg-icons'
export type PropTypes = {
    params: Promise<{
        shortName: string
    }>
}

export default async function PeriodeCommitteePage({ params }: PropTypes) {
    const committee = await getCommittee(params)
    const shortName = (await params).shortName
    const committeePeriodes = unwrapActionReturn(
        await readCommitteeParticipatingPeriodAction({ params: { committeeId: committee.id } })
    )
    if (committeePeriodes.length === 0) { return 'ingen søknadsperioder funnet' }
    return (
        <table>
            <tr>
                <th>Start Dato</th>
                <th>Slutt Dato</th>
                <th>Søknader</th>
                <th>Søknadstall</th>
            </tr>
            {committeePeriodes.map((period, index) => (
                <tr key={index} >
                    <td>{period.startDate.toLocaleDateString('en-GB')}</td>
                    <td>{period.endDate.toLocaleDateString('en-GB')}</td>
                    <td> <Link href={`/committees/${shortName}/periodes/${period.participationId}`} >
                        <FontAwesomeIcon icon={faLink}>
                        </FontAwesomeIcon>
                    </Link>
                    </td>
                    <td>{period.applicationCount}</td>
                </tr>
            ))
            }
        </table >
    )
}
