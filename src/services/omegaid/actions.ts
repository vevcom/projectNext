'use server'
import { ServerSession } from '@/auth/session/ServerSession'
import { createActionError } from '@/services/actionError'
import { ServerError } from '@/services/error'
import { generateOmegaId } from '@/services/omegaid/generate'
import type { ActionReturn } from '@/services/actionTypes'

export async function generateOmegaIdAction(): Promise<ActionReturn<string>> {
    //TODO: when changed to makeAction + operation it should take in a params: userId and
    //then auth on userId using the RequireUserId auther.
    const user = (await ServerSession.fromNextAuth()).user
    if (!user) return createActionError('NOT FOUND', 'User not found')

    const token = generateOmegaId(user)

    return {
        success: true,
        data: token,
    }
}

//Suffix with ...Action when refactoring to operations.
export async function readOmegaJWTPublicKey(): Promise<string> {
    const key = process.env.JWT_PUBLIC_KEY

    if (!key) {
        throw new ServerError('INVALID CONFIGURATION', 'The JWT_PUBLIC_KEY must be set')
    }

    return key
}
