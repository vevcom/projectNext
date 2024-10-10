'use server'

import { createActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { readStudyProgrammes } from '@/services/groups/studyProgrammes/read'
import type { ActionReturn } from '@/actions/Types'
import type { StudyProgramme } from '@prisma/client'


export async function readStudyProgrammesAction(): Promise<ActionReturn<StudyProgramme[]>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['STUDY_PROGRAMME_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readStudyProgrammes())
}
