import { RequirePermission } from '@/auth/auther/RequirePermission'

export const applicationPeriodAuth = {
    readAll: RequirePermission.staticFields({ permission: 'APPLICATION_WRITE' }),
    read: RequirePermission.staticFields({ permission: 'APPLICATION_WRITE' }),
    readNumberOfApplications: RequirePermission.staticFields({ permission: 'APPLICATION_WRITE' }),
    create: RequirePermission.staticFields({ permission: 'APPLICATION_ADMIN' }),
    update: RequirePermission.staticFields({ permission: 'APPLICATION_ADMIN' }),
    removeAllApplicationTexts: RequirePermission.staticFields({ permission: 'APPLICATION_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'APPLICATION_ADMIN' }),
}
