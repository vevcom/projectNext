import { RequireNothing } from '@/auth/authorizer/RequireNothing'

export const standardImageCollectionAuth = {
    readStandardImage: RequireNothing.staticFields({}),
    imagePanel: RequireNothing.staticFields({})
} as const
