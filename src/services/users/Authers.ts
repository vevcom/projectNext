import { AutherOr } from '@/auth/auther/AutherOr'
import { RequirePermission } from '@/auth/auther/RequirePermission'
import { RequireUsername } from '@/auth/auther/RequireUsername'

export const ReadUserAuther = AutherOr([
    RequirePermission({ permission: 'USERS_READ' }),
    RequireUsername(undefined)
])

export const CreateUserAuther = RequirePermission({ permission: 'USERS_CREATE' })

export const UpdateUserAuther = RequirePermission({ permission: 'USERS_UPDATE' })
