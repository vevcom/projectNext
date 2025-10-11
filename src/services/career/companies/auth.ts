import { RequirePermission } from '@/auth/auther/RequirePermission'

export const companyAuth = {
    create: RequirePermission.staticFields({ permission: 'COMPANY_ADMIN' }),
    readPage: RequirePermission.staticFields({ permission: 'COMPANY_READ' }),
    update: RequirePermission.staticFields({ permission: 'COMPANY_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'COMPANY_ADMIN' }),
}
