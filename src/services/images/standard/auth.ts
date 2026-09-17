import { RequireNothing } from '@/auth/authorizer/RequireNothing'

export const standardImagesImagePanelAuth = RequireNothing.staticFields({})

export const standardImageCollectionAuth = {
    readStandardImage: RequireNothing.staticFields({}),
} as const
