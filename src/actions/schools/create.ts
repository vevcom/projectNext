'use server'
import { createActionError, createZodActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import { createSchoolValidation } from '@/services/schools/validation'
import { safeServerCall } from '@/actions/safeServerCall'
import { createSchool } from '@/services/schools/create'
import type { SchoolFiltered } from '@/services/schools/Types'
import type { ActionReturn } from '@/actions/Types'
import type { CreateSchoolTypes } from '@/services/schools/validation'

export async function createSchoolAction(
    rawdata: FormData | CreateSchoolTypes['Type']
): Promise<ActionReturn<SchoolFiltered>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['SCHOOLS_ADMIN']]
    })
    if (!authorized) return createActionError(status)

    const parse = createSchoolValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createSchool(data))
}
