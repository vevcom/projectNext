import { RequireUser } from '@/auth/authorizer/RequireUser'

export const searchAuth = {
    searchUsers: RequireUser.staticFields({}),
    searchEvents: RequireUser.staticFields({}),
} as const
