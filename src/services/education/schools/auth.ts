import { RequirePermission } from '@/auth/auther/RequirePermission'

export const schoolAuth = {
    updateSchoolCmsParagraph: RequirePermission.staticFields({ permission: 'SCHOOLS_ADMIN' }),
    read: RequirePermission.staticFields({ permission: 'SCHOOLS_READ' })
} as const
