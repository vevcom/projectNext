import { RequireNothing } from '@/auth/authorizer/RequireNothing'

export const standardImageAuth = {
    readSpecialCollectionPanel: RequireNothing.staticFields({}),
    readStandardImage: RequireNothing.staticFields({}),
} as const
