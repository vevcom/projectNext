'use server'
import { createActionError, createZodActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { updateSchoolValidation } from '@/education/schools/validation'
import { updateSchool } from '@/services/education/schools/update'
import type { ActionReturn } from '@/actions/Types'
import type { UpdateSchoolTypes } from '@/education/schools/validation'
import type { SchoolFiltered } from '@/education/schools/Types'

export async function updateSchoolAction(
    id: number,
    rawdata: FormData | UpdateSchoolTypes['Type']
): Promise<ActionReturn<SchoolFiltered>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['SCHOOLS_ADMIN']]
    })
    if (!authorized) return createActionError(status)

    const parse = updateSchoolValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => updateSchool(id, data))
}
