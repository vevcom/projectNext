'use client' //Use client to show user correct local time
import styles from './page.module.scss'
import { useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink } from '@fortawesome/free-solid-svg-icons'

type periodType = {
    participationId: number;
    applicationCount: number;
    startDate: Date;
    endDate: Date;
    endPriorityDate: Date;
}

export function PeriodSection({ period, shortName }: { period: periodType, shortName: string }) {
    const [now] = useState(() => Date.now())
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
