import { RequirePermission } from '@/auth/auther/RequirePermission'

export const cabinProductAuthers = {
    read: RequirePermission.staticFields({
        permission: 'CABIN_CALENDAR_READ'
    }),

    create: RequirePermission.staticFields({
        permission: 'CABIN_PRODUCTS_ADMIN'
    }),

    createPrice: RequirePermission.staticFields({
        permission: 'CABIN_PRODUCTS_ADMIN'
    }),
}

