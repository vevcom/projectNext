import { RequirePermission } from '@/auth/authorizer/RequirePermission'

export const lockerReservationAuth = {
    create: RequirePermission.staticFields({ permission: 'LOCKER_USE' }),
    read: RequirePermission.staticFields({ permission: 'LOCKER_USE' }),
    update: RequirePermission.staticFields({ permission: 'LOCKER_USE' }),
}
