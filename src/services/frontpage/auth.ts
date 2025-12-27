import { RequireNothing } from '@/auth/auther/RequireNothing'
import { RequirePermission } from '@/auth/auther/RequirePermission'


export const frontpageAuth = {
    readSpecialCmsParagraphSection: RequireNothing.staticFields({}),
    updateSpecialCmsParagraphContentSection: RequirePermission.staticFields({ permission: 'FRONTPAGE_ADMIN' }),
    readSpecialCmsImage: RequireNothing.staticFields({}),
    updateSpecialCmsImage: RequirePermission.staticFields({ permission: 'FRONTPAGE_ADMIN' })
}
