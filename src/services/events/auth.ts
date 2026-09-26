import { RequireNothing } from '@/auth/authorizer/RequireNothing'
import { RequirePermission } from '@/auth/authorizer/RequirePermission'

export const eventAuth = {
    create: RequirePermission.staticFields({ permission: 'EVENT_CREATE' }),
    read: RequireNothing.staticFields({}),
    readManyCurrent: RequireNothing.staticFields({}),
    readManyArchivedPage: RequireNothing.staticFields({}),
    update: RequirePermission.staticFields({ permission: 'EVENT_ADMIN' }),
    updateCmsCoverImage: RequirePermission.staticFields({ permission: 'EVENT_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'EVENT_ADMIN' }),
    updateParagraphContent: RequirePermission.staticFields({ permission: 'EVENT_ADMIN' }),
}
