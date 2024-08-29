'use server'
import { createActionError } from '../error'
import { safeServerCall } from '../safeServerCall'
import { readSchool, readSchools, readStandardSchools } from '@/services/schools/read'
import { getUser } from '@/auth/getUser'
import type { ActionReturn } from '../Types'
import type { SchoolFiltered } from '@/services/schools/Types'

export async function readSchoolsPageAction() {

}

export async function readStandardSchoolsAction(): Promise<ActionReturn<SchoolFiltered[]>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['SCHOOLS_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readStandardSchools())
}

export async function readSchoolsAction({ onlyNonStandard }: {onlyNonStandard: boolean}): Promise<ActionReturn<SchoolFiltered[]>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['SCHOOLS_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readSchools({ onlyNonStandard }))
}
