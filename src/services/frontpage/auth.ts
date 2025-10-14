import { RequireNothing } from '@/auth/auther/RequireNothing'
import { RequirePermission } from '@/auth/auther/RequirePermission'


export const frontpageAuth = {
    readSpecialCmsParagraphFrontpageSection: RequireNothing.staticFields({}),
    updateSpecialCmsParagraphContentFrontpageSection: RequirePermission.staticFields({ permission: 'FRONTPAGE_ADMIN' })
}
