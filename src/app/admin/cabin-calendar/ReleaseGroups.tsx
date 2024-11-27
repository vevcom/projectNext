'use client'
import styles from './ReleaseGroups.module.scss'
import Button from '@/app/_components/UI/Button'
import { createReleaseGroupAction } from '@/actions/cabin'
import { displayDate } from '@/lib/dates/displayDate'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import type { BookingPeriod, ReleaseGroup } from '@prisma/client'
import PopUp from '@/app/_components/PopUp/PopUp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import UpdateReleaseGroupForm from './UpdateReleaseGroupForm'

export function ReleaseGroups({
    releaseGroups
}: {
    releaseGroups: (ReleaseGroup & {
        bookingPeriods: BookingPeriod[]
    })[]
}) {
    const [groups, setGroups] = useState(releaseGroups)
    async function newReleaseGroup() {
        const results = unwrapActionReturn(await createReleaseGroupAction(null))
        setGroups([...groups, results])
    }

    return <>
        <div className={styles.tableContainer}>
            <table>
                <thead>
                    <tr>
                        <th>Rediger</th>
                        <th>Slippgruppe</th>
                        <th>Slipptid</th>
                        <th>Startdato</th>
                        <th>Sluttdato</th>
                    </tr>
                </thead>
                <tbody>
                    {groups.map(group => {
                        const latestDate = group.bookingPeriods
                            .map(period => period.end)
                            .flat()
                            .reduce((acc: Date | null, val) => ((acc === null || val > acc) ? val : acc), null)
                        const earliesDate = group.bookingPeriods
                            .map(period => period.start)
                            .flat()
                            .reduce((acc: Date | null, val) => ((acc === null || val < acc) ? val : acc), null)
                        return <tr key={uuid()}>
                            <td>
                                <PopUp
                                    showButtonContent={<FontAwesomeIcon icon={faPencil} />}
                                    showButtonClass={styles.editButton}
                                    PopUpKey={uuid()}
                                >
                                    <UpdateReleaseGroupForm releaseGroup={group} />
                                </PopUp>
                            </td>
                            <td>{group.id}</td>
                            <td>{group.releaseTime ? displayDate(group.releaseTime) : 'Aldri'}</td>
                            <td>{earliesDate ? displayDate(earliesDate, false) : '-'}</td>
                            <td>{latestDate ? displayDate(latestDate, false) : '-'}</td>
                        </tr>
                    }
                    )}
                </tbody>
            </table>
        </div>

        <Button onClick={newReleaseGroup}>Ny slippgruppe</Button>
    </>
}
