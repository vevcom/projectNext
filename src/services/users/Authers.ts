import { RequirePermission } from '@/auth/auther/RequirePermission'
import { RequireUserIdOrPermission } from '@/auth/auther/RequireUserIdOrPermission'
import { RequireUsernameOrPermission } from '@/auth/auther/RequireUsernameOrPermission'

export const ReadUserAuther = RequireUsernameOrPermission.staticFields({ permission: 'USERS_READ' })

export const UserProfileUpdateAuther = RequireUsernameOrPermission.staticFields({ permission: 'USERS_UPDATE' })

export const CreateUserAuther = RequirePermission.staticFields({ permission: 'USERS_CREATE' })

export const UpdateUserAuther = RequirePermission.staticFields({ permission: 'USERS_UPDATE' })

export const ConnectUserStudentCardAuther = RequirePermission.staticFields({ permission: 'USERS_CONNECT_STUDENT_CARD' })
export const RegisterStudentCardInQueueAuther =
    RequireUserIdOrPermission.staticFields({ permission: 'USERS_CONNECT_STUDENT_CARD' })

