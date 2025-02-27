import { RequireNothing } from '@/auth/auther/RequireNothing'
import { RequirePermission } from '@/auth/auther/RequirePermission'
import { RequireUserFieldOrPermission } from '@/auth/auther/RequireUserFieldOrPermission'
import { RequireUserId } from '@/auth/auther/RequireUserId'
import { RequireUserIdOrPermission } from '@/auth/auther/RequireUserIdOrPermission'
import { RequireUsernameOrPermission } from '@/auth/auther/RequireUsernameOrPermission'

export namespace UserAuthers {
    export const readProfile = RequireUsernameOrPermission.staticFields({ permission: 'USERS_READ' })
    export const read = RequireUserFieldOrPermission.staticFields({ permission: 'USERS_READ' })
    export const readOrNull = RequireUserFieldOrPermission.staticFields({ permission: 'USERS_READ' })
    export const readPage = RequirePermission.staticFields({ permission: 'USERS_READ' })
    export const create = RequirePermission.staticFields({ permission: 'USERS_CREATE' })
    export const connectStudentCard = RequirePermission.staticFields({ permission: 'USERS_CONNECT_STUDENT_CARD' })
    export const registerStudentCardInQueue =
    RequireUserIdOrPermission.staticFields({ permission: 'USERS_CONNECT_STUDENT_CARD' })
    export const registerNewEmail = RequireUserIdOrPermission.staticFields({ permission: 'USERS_UPDATE' })
    export const verifyEmail = RequireNothing.staticFields({})
    export const updatePassword = RequireUserIdOrPermission.staticFields({ permission: 'USERS_UPDATE' })
    export const update = RequirePermission.staticFields({ permission: 'USERS_UPDATE' })
    export const register = RequireUserId.staticFields({})
    export const destroy = RequirePermission.staticFields({ permission: 'USERS_DESTROY' })
}
