import { RequirePermission } from '@/auth/auther/RequirePermission'
import { RequireUserFieldOrPermission } from '@/auth/auther/RequireUserFieldOrPermission'
import { RequireUserId } from '@/auth/auther/RequireUserId'
import { RequireUserIdOrPermission } from '@/auth/auther/RequireUserIdOrPermission'
import { RequireUsernameOrPermission } from '@/auth/auther/RequireUsernameOrPermission'

export const userAuth = {
    readProfile: RequireUsernameOrPermission.staticFields({ permission: 'USERS_READ' }),
    read: RequireUserFieldOrPermission.staticFields({ permission: 'USERS_READ' }),
    readOrNull: RequireUserFieldOrPermission.staticFields({ permission: 'USERS_READ' }),
    readPage: RequirePermission.staticFields({ permission: 'USERS_READ' }),
    create: RequirePermission.staticFields({ permission: 'USERS_CREATE' }),
    connectStudentCard: RequirePermission.staticFields({ permission: 'USERS_CONNECT_STUDENT_CARD' }),
    registerStudentCardInQueue: RequireUserIdOrPermission.staticFields({ permission: 'USERS_CONNECT_STUDENT_CARD' }),
    registerNewEmail: RequireUserIdOrPermission.staticFields({ permission: 'USERS_UPDATE' }),
    updatePassword: RequireUserIdOrPermission.staticFields({ permission: 'USERS_UPDATE' }),
    update: RequirePermission.staticFields({ permission: 'USERS_UPDATE' }),

    // TODO: Implement method for updating profile,
    // IDEA: profile = a user can do it themselvs. Just user - only an admin can do it
    updateProfile: RequireUsernameOrPermission.staticFields({ permission: 'USERS_UPDATE' }),

    register: RequireUserId.staticFields({}),
    destroy: RequirePermission.staticFields({ permission: 'USERS_DESTROY' }),
}
