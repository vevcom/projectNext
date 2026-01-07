import { RequireNothing } from '@/auth/authorizer/RequireNothing'
import { RequireOneOfPermission } from '@/auth/authorizer/RequireOneOfPermission'

export const careerAuth = {
    readSpecialCmsParagraphCareerInfo: RequireNothing.staticFields({}),
    updateSpecialCmsParagraphContentCareerInfo: RequireOneOfPermission.staticFields({
        permissions: ['JOBAD_UPDATE', 'COMMITTEE_UPDATE']
    }),
    readSpecialCmsLink: RequireNothing.staticFields({}),
    updateSpecialCmsLink: RequireOneOfPermission.staticFields({
        permissions: ['JOBAD_UPDATE', 'COMMITTEE_UPDATE']
    })
} as const
