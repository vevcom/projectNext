'use server'
import { CreateAdmissionTrialAuther } from './Authers'
import { createActionError, createZodActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { createAdmissionTrial } from '@/services/admission/create'
import { createAdmissionTrialValidation } from '@/services/admission/validation'
import { Session } from '@/auth/Session'
import type { ActionReturn } from '@/actions/Types'
import type { Admission, AdmissionTrial } from '@prisma/client'


export async function createAdmissionTrialAction(
    admission: Admission,
    userId: FormData | number
): Promise<ActionReturn<AdmissionTrial>> {
    const session = await Session.fromNextAuth()
    const authRes = CreateAdmissionTrialAuther.dynamicFields({}).auth(session)

    if (!authRes.authorized) return createActionError(authRes.status)

    const parse = createAdmissionTrialValidation.typeValidate({
        userId: typeof userId === 'number' ? userId : Number(userId.get('userId')),
        admission,
        registeredBy: authRes.session.user.id,
    })

    if (!parse.success) return createZodActionError(parse)

    return await safeServerCall(() => createAdmissionTrial(parse.data))
}
