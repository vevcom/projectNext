import { RequirePermission } from '@/auth/auther/RequirePermission'
import { RequirePermissionAndUserId } from '@/auth/auther/RequirePermissionAndUserId'
import { RequireUserIdOrPermission } from '@/auth/auther/RequireUserIdOrPermission'

export const createDotAuther = RequirePermissionAndUserId.staticFields({ permission: 'DOTS_ADMIN' })

export const updateDotAuther = RequirePermission.staticFields({ permission: 'DOTS_ADMIN' })

export const destroyDotAuther = RequirePermission.staticFields({ permission: 'DOTS_ADMIN' })

export const readDotForUserAuther = RequireUserIdOrPermission.staticFields({ permission: 'DOTS_ADMIN' })

export const readDotAuther = RequirePermission.staticFields({ permission: 'DOTS_ADMIN' })
