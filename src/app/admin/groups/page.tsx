import { readGroups } from '@/actions/groups/read'
// import type { GroupType } from '@prisma/client'

// const groupTypes: Record<GroupType, string> = {
//     CLASS: 'Klasse',
//     COMMITEE: 'Komité',
//     INTEREST_GROUP: 'Interessegruppe',
//     OMEGA_MEMBERSHIP: 'Omega medlemskap',
//     STUDY_PROGRAMME: 'Studieprogram'
// }

export default async function Groups() {
    const res = await readGroups()

    if (!res.success) throw Error(res.error ? res.error[0].message : 'error')

    const groups = res.data

    return <>
        <h1>Grupper</h1>
        <table>
            <thead>
                <tr>Navn</tr>
                <tr>Type</tr>
            </thead>
            <tbody>
                {groups.map(group => <>
                    <tr>{group.name}</tr>
                    <tr>{group.groupType}</tr>
                </>)}
            </tbody>
        </table>
    </>
}
