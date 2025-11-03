import { RequireNothing } from '@/auth/auther/RequireNothing'


export const newsAuth = {
    // Should prob. be a permission:
    create: RequireNothing.staticFields({}),
    // visibility 1 (admin)
    destroy: RequireNothing.staticFields({}),
    update: RequireNothing.staticFields({}),
    updateArticle: RequireNothing.staticFields({}),
    //visibility 2 (read)
    readCurrent: RequireNothing.staticFields({}), // auth filter!!
    readOldPage: RequireNothing.staticFields({}), // auth filter!!
    read: RequireNothing.staticFields({}),
} as const
