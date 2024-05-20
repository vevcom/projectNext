"use server"

import { ActionReturn } from "@/actions/Types"
import { createActionError, createZodActionError } from "@/actions/error"
import { safeServerCall } from "@/actions/safeServerCall"
import { getUser } from "@/auth/getUser"
import { createStudyProgramme } from "@/server/groups/studyProgrammes/create"
import { createStudyProgramValidation } from "@/server/groups/studyProgrammes/validation"
import { StudyProgramme } from "@prisma/client"


export async function createStudyProgramAction(rawdata: FormData): Promise<ActionReturn<StudyProgramme>> {

    const { authorized, status } = await getUser({
        requiredPermissions: [[ 'STUDY_PROGRAMME_CREATE' ]],
    })
    if (!authorized) return createActionError(status)

    const parse = createStudyProgramValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)

    return await safeServerCall(() => createStudyProgramme(parse.data))
}