import { RequirePermission } from '@/auth/auther/RequirePermission'
import { RequirePermissionAndUserId } from '@/auth/auther/RequirePermissionAndUserId'
import { RequireUsernameOrPermission } from '@/auth/auther/RequireUsernameOrPermission'

export const CreateDotAuther = RequirePermissionAndUserId.staticFields({ permission: 'DOTS_ADMIN' })

export const UpdateDotAuther = RequirePermission.staticFields({ permission: 'DOTS_ADMIN' })

export const DestroyDotAuther = RequirePermission.staticFields({ permission: 'DOTS_ADMIN' })

export const ReadDotAuther = RequireUsernameOrPermission.staticFields({ permission: 'DOTS_ADMIN' })
