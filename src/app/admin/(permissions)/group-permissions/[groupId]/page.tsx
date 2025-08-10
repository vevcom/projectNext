import { readPermissionOfGroupAction } from '@/actions/permissions'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'


export default async function GroupPermissions({ params }: { params: Promise<{ groupId: string }> }) {
    const groupIdStr = (await params).groupId
    const groupId = parseInt(groupIdStr, 10)

    const permissions = unwrapActionReturn(await readPermissionOfGroupAction({ groupId }))

    return <div>
        <h4>Group ID: {groupId}</h4>

        <ul>
            {permissions.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
    </div>
}
