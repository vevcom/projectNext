'use client' //Use client to show user correct local time
import styles from './page.module.scss'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink } from '@fortawesome/free-solid-svg-icons'

type periodType = {
    participationId: number;
    applicationCount: number;
    startDate: Date;
    endDate: Date;
    endPriorityDate: Date;
    isOpen: boolean;
}

export function PeriodSection({ period, shortName }: { period: periodType, shortName: string }) {
    const entriesClassName = `${styles.tableEntry} ${period.isOpen && styles.currentPeriodEntry}`
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
            <td className={entriesClassName} >
                <Link href={`/committees/${shortName}/applicationPeriods/${period.participationId}`} >
                    <FontAwesomeIcon icon={faLink}>
                    </FontAwesomeIcon>
                </Link>
            </td>
            <td className={entriesClassName} >{period.applicationCount}</td>
        </tr>
    )
}
