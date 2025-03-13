import { RequireNothing } from '@/auth/auther/RequireNothing'
import { RequirePermissioAndUser } from '@/auth/auther/RequirePermissionAndUser'

export namespace AdmissionAuthers {
    export const createTrial = RequirePermissioAndUser.staticFields({
        permission: 'ADMISSION_TRIAL_CREATE',
    })
    export const readTrial = RequireNothing.staticFields({})
}
