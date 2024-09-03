'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import { readLatestOmbul, readOmbul, readOmbuls } from '@/services/ombul/read'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedOmbul } from '@/services/ombul/Types'
import type { Ombul } from '@prisma/client'

export async function readLatestOmbulAction(): Promise<ActionReturn<Ombul>> {
    //Auth route
    const { status, authorized } = await getUser({
        requiredPermissions: [['OMBUL_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readLatestOmbul())
}

export async function readOmbulAction(idOrNameAndYear: number | {
    name: string,
    year: number,
}): Promise<ActionReturn<ExpandedOmbul>> {
    //Auth route
    const { status, authorized } = await getUser({
        requiredPermissions: [['OMBUL_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readOmbul(idOrNameAndYear))
}

export async function readOmbulsAction(): Promise<ActionReturn<ExpandedOmbul[]>> {
    //Auth route
    const { status, authorized } = await getUser({
        requiredPermissions: [['OMBUL_READ']]
    })
    if (!authorized) {
        return createActionError(status)
    }
    return await safeServerCall(() => readOmbuls())
}
