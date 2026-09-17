import { RequirePermission } from '@/auth/authorizer/RequirePermission'

export const schoolAuth = {
    create: RequirePermission.staticFields({ permission: 'SCHOOLS_ADMIN' }),
    createStandard: RequirePermission.staticFields({ permission: 'SCHOOLS_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'SCHOOLS_ADMIN' }),
    read: RequirePermission.staticFields({ permission: 'SCHOOLS_READ' }),
    readExpandedPage: RequirePermission.staticFields({ permission: 'SCHOOLS_READ' }),
    readStandard: RequirePermission.staticFields({ permission: 'SCHOOLS_READ' }),
    readMany: RequirePermission.staticFields({ permission: 'SCHOOLS_READ' }),
    update: RequirePermission.staticFields({ permission: 'SCHOOLS_ADMIN' }),
    updateCmsParagraphContent: RequirePermission.staticFields({ permission: 'SCHOOLS_ADMIN' }),
    updateCmsImage: RequirePermission.staticFields({ permission: 'SCHOOLS_ADMIN' }),
    updateCmsLink: RequirePermission.staticFields({ permission: 'SCHOOLS_ADMIN' }),
} as const
