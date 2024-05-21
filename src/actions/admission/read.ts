'use server'

import { createActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { readAdmission, readAdmissions } from '@/server/admission/read'
import type { Admissions } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'


export async function readAllActiveAdmissionsAction(): Promise<ActionReturn<Admissions[]>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['ADMISSION_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readAdmissions({
        archived: false,
    }))
}

export async function readAdmissionAction(id: number): Promise<ActionReturn<Admissions>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['ADMISSION_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readAdmission(id))
}
