'use server'

import { getUser } from "@/auth/getUser";
import { UpdateSchoolTypes, updateSchoolValidation } from "@/services/schools/validation";
import { createActionError, createZodActionError } from "../error";
import { safeServerCall } from "../safeServerCall";
import { updateSchool } from "@/services/schools/update";

export async function updateSchoolAction(id: number, rawdata: FormData | UpdateSchoolTypes['Type']) {
    const { authorized, status } = await getUser({
        requiredPermissions: [['SCHOOLS_ADMIN']]
    })
    if (!authorized) return createActionError(status)

    const parse = updateSchoolValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => updateSchool(id, data))
}