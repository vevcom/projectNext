import { RequirePermission } from '@/auth/auther/RequirePermission'

export const CreateReleasePeriodAuther = RequirePermission.staticFields({ permission: 'CABIN_ADMIN' })
export const ReadReleasePeriodAuther = RequirePermission.staticFields({ permission: 'CABIN_ADMIN' })
export const UpdateReleasePeriodAuther = RequirePermission.staticFields({ permission: 'CABIN_ADMIN' })
export const DeleteReleasePeriodAuther = RequirePermission.staticFields({ permission: 'CABIN_ADMIN' })
