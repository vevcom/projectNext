import { RequirePermission } from '@/auth/auther/RequirePermission'

export namespace GroupAuthers {
    export const read = RequirePermission.staticFields({ permission: 'GROUP_READ' })
}
