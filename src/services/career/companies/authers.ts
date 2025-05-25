import { RequirePermission } from '@/auth/auther/RequirePermission'

export namespace CompanyAuthers {
    export const create = RequirePermission.staticFields({ permission: 'COMPANY_ADMIN' })
    export const readPage = RequirePermission.staticFields({ permission: 'COMPANY_READ' })
    export const update = RequirePermission.staticFields({ permission: 'COMPANY_ADMIN' })
    export const destroy = RequirePermission.staticFields({ permission: 'COMPANY_ADMIN' })
}
