'use server'

import { createActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import { generateOmegaId } from '@/services/omegaid/generate'
import type { ActionReturn } from '@/actions/Types'


export async function generateOmegaIdAction(): Promise<ActionReturn<string>> {
    const { user, authorized, status } = await getUser({
        userRequired: true,
    })

    if (!authorized) return createActionError(status)

    const token = generateOmegaId(user)

    return {
        success: true,
        data: token,
    }
}
