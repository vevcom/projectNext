import styles from './page.module.scss';
import { readGroupsAction } from '@/actions/groups/read';
import { notFound } from 'next/navigation';
import { GroupType } from '@prisma/client';
import type { ExpandedGroup } from '@/server/groups/Types';
import { GroupTypesConfig } from '@/server/groups/ConfigVars';
import GroupAdmin from './GroupAdmin';

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
            acc[group.groupType] = {
                name: GroupTypesConfig[group.groupType].name,
                description: GroupTypesConfig[group.groupType].description,
                groups: []
            }
        }
        acc[group.groupType].groups.push(group)
        return acc
    }, {} as { 
        [key: string]: {
            name: string,
            description: string,
            groups: ExpandedGroup[] 
        }
    })

    const ordering : string[] = ['OMEGA_MEMBERSHIP_GROUP', 'CLASS', 'STUDY_PROGRAMME', 
    'COMMITTEE', 'INTEREST_GROUP', 'MANUAL_GROUP'] satisfies GroupType[];

    return (
        <div className={styles.wrapper}>
            <h1>Grupper</h1>
            <div className={styles.groupsList}>
            {
                Object.entries(sortedGroups).sort(([a], [b]) => ordering.indexOf(a) - ordering.indexOf(b)).map(([key, groupType]) => (
                    <div className={styles.groupType} key={key}>
                        <h2>{groupType.name}</h2>
                        <i>{groupType.description}</i>
                        <table>
                            <thead>
                                <tr>
                                    <td>Id</td>
                                    <td>Navn</td>
                                    <td>Medlemmer</td>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                groupType.groups.map(group => (
                                    <tr key={group.id}>
                                        <td>{group.id}</td>
                                        <td>{'navn'}</td>
                                        <td>{10}</td>
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