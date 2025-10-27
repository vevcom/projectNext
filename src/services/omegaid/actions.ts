'use server'
import { createActionError } from '@/services/actionError'
import { ServerError } from '@/services/error'
import { generateOmegaId } from '@/services/omegaid/generate'
import type { ActionReturn } from '@/services/actionTypes'
import { Session } from '@/auth/session/Session'

export async function generateOmegaIdAction(): Promise<ActionReturn<string>> {
    //TODO: when changed to makeAction + operation it should take in a params: userId and
    //then auth on userId using the RequireUserId auther.
    const user = (await Session.fromNextAuth()).user
    if (!user) return createActionError('User not found')

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
