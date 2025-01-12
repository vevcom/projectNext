import { RequirePermissioAndUser } from '@/auth/auther/RequirePermissionAndUser'

export const createAdmissionTrialAuther = RequirePermissioAndUser.staticFields({
    permission: 'ADMISSION_TRIAL_CREATE',
})
