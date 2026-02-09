import { RequirePermission } from '@/auth/authorizer/RequirePermission'

export const jobAdAuth = {
    create: RequirePermission.staticFields({ permission: 'JOBAD_ADMIN' }),
    read: RequirePermission.staticFields({ permission: 'JOBAD_READ' }),
    readActive: RequirePermission.staticFields({ permission: 'JOBAD_READ' }),
    readInactivePage: RequirePermission.staticFields({ permission: 'JOBAD_READ' }),
    update: RequirePermission.staticFields({ permission: 'JOBAD_ADMIN' }),
    updateArticle: RequirePermission.staticFields({ permission: 'JOBAD_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'JOBAD_ADMIN' }),
}
