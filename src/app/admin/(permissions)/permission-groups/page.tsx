import { readGroupsExpandedAction } from '@/actions/groups/read'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import Link from 'next/link'


export default async function PermissionGroups() {
    const groups = unwrapActionReturn(await readGroupsExpandedAction())

    return <div>
        <ul>
            {groups.map((group, i) => <li key={i}>
                <Link href={`/admin/permission-groups/${group.id}`}>{group.name}</Link>
            </li>)}
        </ul>
    </div>
}
