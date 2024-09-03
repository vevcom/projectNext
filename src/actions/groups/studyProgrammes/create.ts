'use server'

import { createActionError, createZodActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { createStudyProgramme } from '@/services/groups/studyProgrammes/create'
import { createStudyProgrammeValidation } from '@/services/groups/studyProgrammes/validation'
import type { ActionReturn } from '@/actions/Types'
import type { StudyProgramme } from '@prisma/client'


export async function createStudyProgrammeAction(rawdata: FormData): Promise<ActionReturn<StudyProgramme>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['STUDY_PROGRAMME_CREATE']],
    })
    if (!authorized) return createActionError(status)

    const parse = createStudyProgrammeValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)

    return await safeServerCall(() => createStudyProgramme(parse.data))
}
