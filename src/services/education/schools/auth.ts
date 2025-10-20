import { RequirePermission } from '@/auth/auther/RequirePermission'

export const schoolAuth = {
    updateCmsParagraph: RequirePermission.staticFields({ permission: 'SCHOOLS_ADMIN' }),
    read: RequirePermission.staticFields({ permission: 'SCHOOLS_READ' }),
    updateCmsImage: RequirePermission.staticFields({ permission: 'SCHOOLS_ADMIN' })
} as const
