'use server'

import { createActionError, createZodActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { updateStudyProgramme } from '@/server/groups/studyProgrammes/update'
import { updateStudyProgrammeValidation } from '@/server/groups/studyProgrammes/validation'
import type { ActionReturn } from '@/actions/Types'
import type { StudyProgramme } from '@prisma/client'


export async function updateStudyProgrammeAction(id: number, rawdata: FormData): Promise<ActionReturn<StudyProgramme>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['STUDY_PROGRAMME_UPDATE']],
    })
    if (!authorized) return createActionError(status)

    const parse = updateStudyProgrammeValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)

    return await safeServerCall(() => updateStudyProgramme({
        ...parse.data,
        id,
    }))
}
