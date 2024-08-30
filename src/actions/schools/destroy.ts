'use server'
import { createActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { destroySchool } from '@/services/schools/destroy'
import type { ActionReturn } from '@/actions/Types'

export async function destroySchoolAction(id: number): Promise<ActionReturn<void>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['SCHOOLS_ADMIN']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => destroySchool(id))
}
