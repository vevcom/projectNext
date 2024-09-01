'use server'

import { ServerError } from '@/services/error'


export async function readOmegaJWTPublicKey(): Promise<string> {
    const key = process.env.JWT_PUBLIC_KEY

    if (!key) {
        throw new ServerError('INVALID CONFIGURATION', 'The JWT_PUBLIC_KEY must be set')
    }

    return key
}
