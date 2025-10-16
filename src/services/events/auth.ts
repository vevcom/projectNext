import { RequireNothing } from '@/auth/auther/RequireNothing'
import { RequirePermission } from '@/auth/auther/RequirePermission'

export const eventAuth = {
    create: RequirePermission.staticFields({ permission: 'EVENT_CREATE' }),
    // TODO: Replace below with proper authers
    read: RequireNothing.staticFields({}),
    readManyCurrent: RequireNothing.staticFields({}),
    readManyArchivedPage: RequireNothing.staticFields({}),
    update: RequireNothing.staticFields({}),
    destroy: RequireNothing.staticFields({}),
    updateParagraphContent: RequireNothing.staticFields({}),
}
