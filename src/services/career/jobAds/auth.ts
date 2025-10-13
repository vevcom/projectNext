import { RequirePermission } from '@/auth/auther/RequirePermission'

export const jobAdAuth = {
    create: RequirePermission.staticFields({ permission: 'JOBAD_CREATE' }),
    read: RequirePermission.staticFields({ permission: 'JOBAD_READ' }),
    readActive: RequirePermission.staticFields({ permission: 'JOBAD_READ' }),
    readInactivePage: RequirePermission.staticFields({ permission: 'JOBAD_READ' }),
    update: RequirePermission.staticFields({ permission: 'JOBAD_UPDATE' }),
    destroy: RequirePermission.staticFields({ permission: 'JOBAD_DESTROY' }),
}
