import { RequirePermission } from '@/auth/auther/RequirePermission'
import { RequirePermissionAndUserId } from '@/auth/auther/RequirePermissionAndUserId'
import { RequireUserIdOrPermission } from '@/auth/auther/RequireUserIdOrPermission'

export const CreateDotAuther = RequirePermissionAndUserId.staticFields({ permission: 'DOTS_ADMIN' })

export const UpdateDotAuther = RequirePermission.staticFields({ permission: 'DOTS_ADMIN' })

export const DestroyDotAuther = RequirePermission.staticFields({ permission: 'DOTS_ADMIN' })

export const ReadDotAuther = RequireUserIdOrPermission.staticFields({ permission: 'DOTS_ADMIN' })
