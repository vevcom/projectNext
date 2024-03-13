'use server'
import { createActionError } from '@/actions/error'
import { getUser } from '@/auth/user'
import { readLatestOmbul, readOmbul, readOmbuls } from '@/server/ombul/read'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedOmbul } from '@/server/ombul/Types'
import type { Ombul } from '@prisma/client'

export async function readLatestOmbulAction(): Promise<ActionReturn<Ombul>> {
    //Auth route
    const { status, authorized } = await getUser({
        requiredPermissions: ['OMBUL_READ']
    })
    if (!authorized) {
        return createActionError(status)
    }
    return await readLatestOmbul()
}

export async function readOmbulAction(idOrNameAndYear: number | {
    name: string,
    year: number,
}): Promise<ActionReturn<ExpandedOmbul>> {
    //Auth route
    const { status, authorized } = await getUser({
        requiredPermissions: ['OMBUL_READ']
    })
    if (!authorized) {
        return createActionError(status)
    }
    return await readOmbul(idOrNameAndYear)
}

export async function readOmbulsAction(): Promise<ActionReturn<ExpandedOmbul[]>> {
    //Auth route
    const { status, authorized } = await getUser({
        requiredPermissions: ['OMBUL_READ']
    })
    if (!authorized) {
        return createActionError(status)
    }
    return await readOmbuls()
}
