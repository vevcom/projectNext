import { RequirePermission } from '@/auth/authorizer/RequirePermission'

export const schoolAuth = {
    create: RequirePermission.staticFields({ permission: 'SCHOOLS_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'SCHOOLS_ADMIN' }),
    readPage: RequirePermission.staticFields({ permission: 'SCHOOLS_READ' }),
    readStandard: RequirePermission.staticFields({ permission: 'SCHOOLS_READ' }),
    readMany: RequirePermission.staticFields({ permission: 'SCHOOLS_READ' }),
    update: RequirePermission.staticFields({ permission: 'SCHOOLS_ADMIN' }),
    updateCmsParagraph: RequirePermission.staticFields({ permission: 'SCHOOLS_ADMIN' }),
    read: RequirePermission.staticFields({ permission: 'SCHOOLS_READ' }),
    updateCmsImage: RequirePermission.staticFields({ permission: 'SCHOOLS_ADMIN' }),
    updateCmsLink: RequirePermission.staticFields({ permission: 'SCHOOLS_ADMIN' }),
} as const
