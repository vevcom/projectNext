import { RequireNothing } from '@/auth/auther/RequireNothing'
import { RequirePermission } from '@/auth/auther/RequirePermission'

export namespace EventTagAuthers {
    export const create = RequirePermission.staticFields({ permission: 'EVENT_ADMIN' })
    export const readSpecial = RequireNothing.staticFields({})
    export const read = RequireNothing.staticFields({})
    export const readAll = RequireNothing.staticFields({})
    export const update = RequirePermission.staticFields({ permission: 'EVENT_ADMIN' })
    export const destroy = RequirePermission.staticFields({ permission: 'EVENT_ADMIN' })
}
