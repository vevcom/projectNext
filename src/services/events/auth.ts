import { RequireNothing } from '@/auth/authorizer/RequireNothing'
import { RequirePermission } from '@/auth/authorizer/RequirePermission'

export const eventAuth = {
    create: RequirePermission.staticFields({ permission: 'EVENT_CREATE' }),
    // TODO: Replace below with proper authorizers
    read: RequireNothing.staticFields({}),
    readManyCurrent: RequireNothing.staticFields({}),
    readManyArchivedPage: RequireNothing.staticFields({}),
    update: RequireNothing.staticFields({}),
    updateCmsCoverImage: RequireNothing.staticFields({}),
    destroy: RequireNothing.staticFields({}),
    updateParagraphContent: RequireNothing.staticFields({}),
}
