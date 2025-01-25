import { RequirePermission } from '@/auth/auther/RequirePermission'
import { RequireUserIdOrPermission } from '@/auth/auther/RequireUserIdOrPermission'
import { RequireUsernameOrPermission } from '@/auth/auther/RequireUsernameOrPermission'

export const readUserAuther = RequireUsernameOrPermission.staticFields({ permission: 'USERS_READ' })

export const userProfileUpdateAuther = RequireUsernameOrPermission.staticFields({ permission: 'USERS_UPDATE' })

export const createUserAuther = RequirePermission.staticFields({ permission: 'USERS_CREATE' })

export const updateUserAuther = RequirePermission.staticFields({ permission: 'USERS_UPDATE' })

export const connectUserStudentCardAuther = RequirePermission.staticFields({ permission: 'USERS_CONNECT_STUDENT_CARD' })
export const registerStudentCardInQueueAuther =
    RequireUserIdOrPermission.staticFields({ permission: 'USERS_CONNECT_STUDENT_CARD' })

