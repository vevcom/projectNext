import { RequirePermission } from '@/auth/auther/RequirePermission'

export namespace JobAdAuthers {
    export const create = RequirePermission.staticFields({ permission: 'JOBAD_CREATE' })
    export const read = RequirePermission.staticFields({ permission: 'JOBAD_READ' })
    export const readActive = RequirePermission.staticFields({ permission: 'JOBAD_READ' })
    export const readInactivePage = RequirePermission.staticFields({ permission: 'JOBAD_READ' })
    export const update = RequirePermission.staticFields({ permission: 'JOBAD_UPDATE' })
    export const destroy = RequirePermission.staticFields({ permission: 'JOBAD_DESTROY' })
}
