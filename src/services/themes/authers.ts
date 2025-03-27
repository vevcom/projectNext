import { RequireNothing } from '@/auth/auther/RequireNothing'
import { RequirePermission } from '@/auth/auther/RequirePermission'


export namespace ThemeAuthers {
    export const create = RequirePermission.staticFields({ permission: 'THEME_ADMIN' })
    export const update = RequirePermission.staticFields({ permission: 'THEME_ADMIN' })
    export const destroy = RequirePermission.staticFields({ permission: 'THEME_ADMIN' })
    export const read = RequireNothing.staticFields({})
    export const readAll = RequireNothing.staticFields({})
}
