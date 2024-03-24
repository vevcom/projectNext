import { readGroup } from '@/server/groups/read';
import styles from './page.module.scss';
import { readGroupsAction } from '@/actions/groups/read';
import { notFound } from 'next/navigation';
import type { GroupType } from '@prisma/client';
import type { ExpandedGroup } from '@/server/groups/Types';

/**
 * A page that displays memberships in all groups for admins
 */
export default async function GroupsAdmin() {
    const res = await readGroupsAction()
    if (!res.success) return notFound() //TODO: replace with better error page if error is e.g UNAUTHORIZED.
    const groups = res.data
    //SOrt grups on type
    const sortedGroups = groups.reduce((acc, group) => {
        if (!acc[group.groupType]) {
            acc[group.groupType] = []
        }
        acc[group.groupType].push(group)
        return acc
    }, {} as { [key: string]: ExpandedGroup[] })

    return (
        <div className={styles.wrapper}>
        {
            Object.keys(sortedGroups).map((groupType) => (
                <div key={groupType}>
                    <h1>{groupType}</h1>
                    <ul>
                    {
                        sortedGroups[groupType].map(group => (
                            <li key={group.id}>
                                <h2>{group.id}</h2>
                            </li>
                        ))
                    }
                    </ul>
                </div>
            ))
        }    
        </div>
    )
}