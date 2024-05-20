"use server"

import { ActionReturn } from "@/actions/Types"
import { createActionError, createZodActionError } from "@/actions/error"
import { safeServerCall } from "@/actions/safeServerCall"
import { getUser } from "@/auth/getUser"
import { updateStudyProgramme } from "@/server/groups/studyProgrammes/update"
import { updateStudyProgramValidation } from "@/server/groups/studyProgrammes/validation"
import { StudyProgramme } from "@prisma/client"


export async function updateStudyProgramAction(id: number, rawdata: FormData): Promise<ActionReturn<StudyProgramme>> {

    const { authorized, status } = await getUser({
        requiredPermissions: [[ 'STUDY_PROGRAMME_UPDATE' ]],
    })
    if (!authorized) return createActionError(status)

    const parse = updateStudyProgramValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)

    return await safeServerCall(() => updateStudyProgramme({
        ...parse.data,
        id,
    }))
}