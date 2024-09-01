import { RequirePermissioAndUser } from '@/auth/auther/RequirePermissionAndUser'

export const CreateAdmissionTrialAuther = RequirePermissioAndUser({
    permission: 'ADMISSION_TRIAL_CREATE'
})
