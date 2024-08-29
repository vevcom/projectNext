'use server'
import { CreateSchoolTypes, createSchoolValidation } from "@/services/schools/validation";
import { ActionReturn } from "../Types";
import { School } from "@prisma/client";
import { getUser } from "@/auth/getUser";
import { createActionError, createZodActionError } from "../error";
import { safeServerCall } from "@/actions/safeServerCall";
import { createSchool } from "@/services/schools/create";

export async function createSchoolAction(rawdata: FormData | CreateSchoolTypes['Type']): Promise<ActionReturn<School>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['SCHOOLS_ADMIN']]
    })
    if (!authorized) return createActionError(status)

    const parse = createSchoolValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createSchool(data))
}