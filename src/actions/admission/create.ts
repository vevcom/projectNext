'use server'

import { createActionError, createZodActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { createAdmissionTrial } from '@/services/admission/create'
import { createAdmissionTrialValidation } from '@/services/admission/validation'
import type { ActionReturn } from '@/actions/Types'
import type { Admission } from '@prisma/client'
import type { ExpandedAdmissionTrial } from '@/services/admission/Types'


export async function createAdmissionTrialAction(
    admission: Admission,
    userId: FormData | number
): Promise<ActionReturn<ExpandedAdmissionTrial>> {
    const { user, authorized, status } = await getUser({
        requiredPermissions: [['ADMISSION_TRIAL_CREATE']],
        userRequired: true,
    })
    if (!authorized) return createActionError(status)

    const parse = createAdmissionTrialValidation.typeValidate({
        userId: typeof userId === 'number' ? userId : Number(userId.get('userId')),
        admission,
        registeredBy: user.id,
    })

    if (!parse.success) return createZodActionError(parse)

    return await safeServerCall(() => createAdmissionTrial(parse.data))
}
