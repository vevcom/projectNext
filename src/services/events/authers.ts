import { RequireNothing } from '@/auth/auther/RequireNothing'
import { RequirePermission } from '@/auth/auther/RequirePermission'

export namespace EventAuthers {
    export const create = RequirePermission.staticFields({ permission: 'EVENT_CREATE' })
    // TODO: Replace below with proper authers
    export const read = RequireNothing.staticFields({})
    export const readManyCurrent = RequireNothing.staticFields({})
    export const readManyArchivedPage = RequireNothing.staticFields({})
    export const update = RequireNothing.staticFields({})
    export const destroy = RequireNothing.staticFields({})
}
