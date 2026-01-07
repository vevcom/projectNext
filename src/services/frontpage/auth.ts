import { RequireNothing } from '@/auth/authorizer/RequireNothing'
import { RequirePermission } from '@/auth/authorizer/RequirePermission'


export const frontpageAuth = {
    readSpecialCmsParagraphFrontpageSection: RequireNothing.staticFields({}),
    updateSpecialCmsParagraphContentFrontpageSection: RequirePermission.staticFields({ permission: 'FRONTPAGE_ADMIN' }),
    readSpecialCmsImage: RequireNothing.staticFields({}),
    updateSpecialCmsImage: RequirePermission.staticFields({ permission: 'FRONTPAGE_ADMIN' })
}
