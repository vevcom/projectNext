import { RequirePermission } from '@/auth/auther/RequirePermission'

export const omegaOrderAuth = {
    //TODO: use authers when refactoring to operations.
    create: RequirePermission.staticFields({ permission: 'OMEGA_ORDER_CREATE' }),
    readCurrent: RequirePermission.staticFields({ permission: 'OMEGA_ORDER_READ' }),
    readAll: RequirePermission.staticFields({ permission: 'OMEGA_ORDER_READ' })
} as const
