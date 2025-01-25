import { RequireNothing } from '@/auth/auther/RequireNothing'
import { RequirePermissioAndUser } from '@/auth/auther/RequirePermissionAndUser'

export const createAdmissionTrialAuther = RequirePermissioAndUser.staticFields({
    permission: 'ADMISSION_TRIAL_CREATE',
})

export const readAdmissionTrialsAuther = RequireNothing.staticFields({})
