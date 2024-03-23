import RoleView from './RoleView'
import { readRolesAction } from '@/actions/permissionRoles/read'

export default async function Roles() {
    const res = await readRolesAction()

    if (!res.success) throw Error(res.error ? res.error[0].message : 'error')

    const { data: roles } = res

    return <>
        <h1>Tillgangsroller</h1>
        <RoleView roles={roles} />
    </>
}
