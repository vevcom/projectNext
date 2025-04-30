import { RequireNothing } from '@/auth/auther/RequireNothing'
import { RequirePermissionAndUser } from '@/auth/auther/RequirePermissionAndUser'

export namespace AdmissionAuthers {
    export const createTrial = RequirePermissionAndUser.staticFields({
        permission: 'ADMISSION_TRIAL_CREATE',
    })
    export const readTrial = RequireNothing.staticFields({})
}
