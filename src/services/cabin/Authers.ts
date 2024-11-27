import { RequirePermission } from '@/auth/auther/RequirePermission'

export const CreateRoomAuther = RequirePermission.staticFields({ permission: 'CABIN_ADMIN' })
export const UpdateRoomAuther = RequirePermission.staticFields({ permission: 'CABIN_ADMIN' })
export const ReadRoomAuther = RequirePermission.staticFields({ permission: 'CABIN_CALENDAR_READ' })

export const CreateBookingPeriodAuther = RequirePermission.staticFields({ permission: 'CABIN_ADMIN' })

