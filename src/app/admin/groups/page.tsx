import styles from './page.module.scss';
import { readGroupsAdmin, readGroupsExpandedAction } from '@/actions/groups/read';
import { notFound } from 'next/navigation';
import { GroupType } from '@prisma/client';
import type { ExpandedGroup } from '@/server/groups/Types';
import { GroupTypeOrdering, GroupTypesConfig } from '@/server/groups/ConfigVars';
import GroupAdmin from './GroupAdmin';
import GroupSelector from './GroupSelector';

/**
 * A page that displays memberships in all groups for admins
 */
export default async function GroupsAdmin() {
    const res = await readGroupsAdmin()
    if (!res.success) return notFound() //TODO: replace with better error page if error is e.g UNAUTHORIZED.
    const groups = res.data

    return (
        <div className={styles.wrapper}>
            <h1>Grupper</h1>
            <div className={styles.groupsList}>
            {
                Object.entries(groups).sort(
                    ([a], [b]) => GroupTypeOrdering.indexOf(a) - GroupTypeOrdering.indexOf(b)
                ).map(([key, groupType]) => (
                    <div className={styles.groupType} key={key}>
                        <h2>{groupType.name}</h2>
                        <i>{groupType.description}</i>
                        <table>
                            <thead>
                                <tr>
                                    <td>Id</td>
                                    <td>Navn</td>
                                    <td>Medlemmer</td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                groupType.groups.map(group => (
                                    <tr key={group.id}>
                                        <td>{group.id}</td>
                                        <td>{'navn'}</td>
                                        <td>{10}</td>
                                        <td><GroupSelector groupId={group.id} /></td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                ))
            }  
            </div>
            <div className={styles.group}>
                <GroupAdmin />
            </div>
        </div>
    )
}