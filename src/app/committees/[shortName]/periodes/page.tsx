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

type periodType = {
    participationId: number;
    applicationCount: number;
    startDate: Date;
    endDate: Date;
    endPriorityDate: Date;
}

export default async function PeriodeCommitteePage({ params }: PropTypes) {
    const committee = await getCommittee(params)
    const shortName = (await params).shortName
    const committeePeriodes = unwrapActionReturn(
        await readCommitteeParticipatingPeriodAction({ params: { committeeId: committee.id } })
    )
    if (committeePeriodes.length === 0) { return 'ingen søknadsperioder funnet' }
    return (
        <table className={styles.periodTable}>
            <tr className={styles.periodHeading}>
                <th className={styles.tableEntry}>Start dato</th>
                <th className={styles.tableEntry}>Slutt dato</th>
                <th className={styles.tableEntry}>Omprioritering slutt dato</th>
                <th className={styles.tableEntry}>Søknader</th>
                <th className={styles.tableEntry}>Søknadstall</th>
            </tr>
            {committeePeriodes.map((period, index) => (
                <PeriodSection shortName={shortName} key={index} period={period}></PeriodSection>
            ))
            }
        </table >
    )
}

function PeriodSection({ period, shortName }: { period: periodType, shortName: string }) {
    'use client' //Use client to show user correct local time
    const now = Date.now()
    const isCurrentPeriod = (now > period.startDate.getTime()) && (now < period.endPriorityDate.getTime())
    const entriesClassName = `${styles.tableEntry} ${isCurrentPeriod && styles.currentPeriodEntry}`
    return (
        <tr className={styles.periodSection}>
            <td className={entriesClassName} >
                {period.startDate.toLocaleDateString('en-GB')},
                kl: {period.startDate.toLocaleTimeString('en-GB')}
            </td>
            <td className={entriesClassName} >
                {period.endDate.toLocaleDateString('en-GB')},
                kl: {period.endDate.toLocaleTimeString('en-GB')}
            </td>
            <td className={entriesClassName} >
                {period.endPriorityDate.toLocaleDateString('en-GB')},
                kl: {period.endPriorityDate.toLocaleTimeString('en-GB')}
            </td>
            <td className={entriesClassName} > <Link href={`/committees/${shortName}/periodes/${period.participationId}`} >
                <FontAwesomeIcon icon={faLink}>
                </FontAwesomeIcon>
            </Link>
            </td>
            <td className={entriesClassName} >{period.applicationCount}</td>
        </tr>
    )
}