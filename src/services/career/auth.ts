import { RequireNothing } from '@/auth/auther/RequireNothing'
import { RequireOneOfPermission } from '@/auth/auther/RequireOneOfPermission'

export const careerAuth = {
    readSpecialCmsParagraphCareerInfo: RequireNothing.staticFields({}),
    updateSpecialCmsParagraphContentCareerInfo: RequireOneOfPermission.staticFields({
        permissions: ['JOBAD_UPDATE', 'COMMITTEE_UPDATE']
    })
}
