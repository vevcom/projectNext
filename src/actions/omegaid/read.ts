'use server'

import { ServerError } from '@/server/error'


export async function readOmegaIdPublicKey(): Promise<string> {
    const key = process.env.OMEGAID_PUBLIC_KEY

    if (!key) {
        throw new ServerError('INVALID CONFIGURATION', 'The OMEGAID_PUBLIC_KEY must be set')
    }

    return key
}
