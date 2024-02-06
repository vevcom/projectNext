import RoleView from './RoleView'
import { readRoles } from '@/actions/permissions/read'

export default async function Permissions() {
    const res = await readRoles()

    if (!res.success) throw Error(res.error ? res.error[0].message : 'error')

    const { data: roles } = res

    return <>
        <h1>Tillgangsnivåer</h1>
        <RoleView roles={roles} />
    </>
}
