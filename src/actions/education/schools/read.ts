'use server'
import { createActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { readSchool, readSchools, readStandardSchools } from '@/services/education/schools/read'
import { getUser } from '@/auth/getUser'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedSchool, SchoolFiltered } from '@/education/schools/Types'

export async function readSchoolsPageAction() {

}

export async function readStandardSchoolsAction(): Promise<ActionReturn<SchoolFiltered[]>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['SCHOOLS_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readStandardSchools())
}

export async function readSchoolsAction({
    onlyNonStandard
}: {
    onlyNonStandard: boolean
}): Promise<ActionReturn<SchoolFiltered[]>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['SCHOOLS_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readSchools({ onlyNonStandard }))
}

export async function readSchoolAction(shortname: string): Promise<ActionReturn<ExpandedSchool>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['SCHOOLS_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readSchool(shortname))
}
