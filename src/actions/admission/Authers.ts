import { RequirePermissioAndUser } from '@/auth/auther/RequirePermissionAndUser'

export const CreateAdmissionTrialAuther = RequirePermissioAndUser.staticFields({
    permission: 'ADMISSION_TRIAL_CREATE',
})
