import { RequirePermission } from '@/auth/auther/RequirePermission'
import { RequireUsernameOrPermission } from '@/auth/auther/RequireUsernameOrPermission'

export const ReadUserAuther = RequireUsernameOrPermission.staticFields({ permission: 'USERS_READ' })

export const UserProfileUpdateAuther = RequireUsernameOrPermission.staticFields({ permission: 'USERS_UPDATE' })

export const CreateUserAuther = RequirePermission.staticFields({ permission: 'USERS_CREATE' })

export const UpdateUserAuther = RequirePermission.staticFields({ permission: 'USERS_UPDATE' })
