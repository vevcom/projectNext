'use client'
import styles from './ReleaseGroups.module.scss'
import Button from '@/app/_components/UI/Button'
import { createReleaseGroupAction } from '@/actions/cabin'
import { displayDate } from '@/lib/dates/displayDate'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import type { ReleaseGroup } from '@prisma/client'

export function ReleaseGroups({
    releaseGroups
}: {
    releaseGroups: ReleaseGroup[]
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
                        <th>Slippgruppe</th>
                        <th>Slipptid</th>
                        <th>Startdato</th>
                        <th>Sluttdato</th>
                    </tr>
                </thead>
                <tbody>
                    {groups.map(group => <tr key={uuid()}>
                        <td>{group.id}</td>
                        <td>{group.releaseTime ? displayDate(group.releaseTime) : 'Aldri'}</td>
                        <td>I sommerferien</td>
                        <td>I Høstferien</td>
                    </tr>)}
                </tbody>
            </table>
        </div>

        <Button onClick={newReleaseGroup}>Ny slippgruppe</Button>
    </>
}
