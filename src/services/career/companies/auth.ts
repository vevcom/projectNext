import { RequirePermission } from '@/auth/auther/RequirePermission'

export const companyAuth = {
    create: RequirePermission.staticFields({ permission: 'COMPANY_ADMIN' }),
    readPage: RequirePermission.staticFields({ permission: 'COMPANY_READ' }),
    update: RequirePermission.staticFields({ permission: 'COMPANY_ADMIN' }),
    updateCmsImageLogo: RequirePermission.staticFields({ permission: 'COMPANY_ADMIN' }),
    updateSpecialCmsLink: RequirePermission.staticFields({ permission: 'COMPANY_ADMIN' }),
    readSpecialCmsLink: RequirePermission.staticFields({ permission: 'COMPANY_READ' }),
    destroy: RequirePermission.staticFields({ permission: 'COMPANY_ADMIN' }),
}
