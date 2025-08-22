'use server'

import { createActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import { ServerError } from '@/services/error'
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

export async function readOmegaJWTPublicKey(): Promise<string> {
    const key = process.env.JWT_PUBLIC_KEY

    if (!key) {
        throw new ServerError('INVALID CONFIGURATION', 'The JWT_PUBLIC_KEY must be set')
    }

    return key
}
