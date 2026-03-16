'use server'

import { createZodActionError, safeServerCall } from '@/services/actionError'
import { createStudyProgramme } from '@/services/groups/studyProgrammes/create'
import { readStudyProgrammes } from '@/services/groups/studyProgrammes/read'
import { updateStudyProgramme } from '@/services/groups/studyProgrammes/update'
import { createStudyProgrammeValidation, updateStudyProgrammeValidation } from '@/services/groups/studyProgrammes/validation'
import type { ActionReturn } from '@/services/actionTypes'
import type { StudyProgramme } from '@/prisma-generated-pn-types'

export async function createStudyProgrammeAction(rawdata: FormData): Promise<ActionReturn<StudyProgramme>> {
    const parse = createStudyProgrammeValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)

    return await safeServerCall(() => createStudyProgramme(parse.data))
}

export async function readStudyProgrammesAction(): Promise<ActionReturn<StudyProgramme[]>> {
    return await safeServerCall(() => readStudyProgrammes())
}

export async function updateStudyProgrammeAction(id: number, rawdata: FormData): Promise<ActionReturn<StudyProgramme>> {
    const parse = updateStudyProgrammeValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)

    return await safeServerCall(() => updateStudyProgramme({
        ...parse.data,
        id,
    }))
}
