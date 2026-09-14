import { RequireUserId } from '@/auth/authorizer/RequireUserId'
import { RequireNothing } from '@/auth/authorizer/RequireNothing'

export const omegaIdAuth = {
    generate: RequireUserId.staticFields({}),
    readPublicKey: RequireNothing.staticFields({}),
} as const
