import { deflate, inflate } from 'zlib'
import { promisify } from 'util'
import type { JWT } from 'next-auth/jwt'

// THIS WAKY COMPRESSING AND DECOMPRESSING STUFF IS TEMPORARY
// TO REDUCE JWT SIZE UNTIL WE HAVE EITHER:
// 1) MORE REASONABLE PERMISSIONS ENCODING
// 2) SWITCHED TO DATABASE SESSIONS
// 3) FIX THE JWT TYPE TO SUPPORT COMPRESSION PROPERLY

const deflateAsync = promisify(deflate)
const inflateAsync = promisify(inflate)

// eslint-disable-next-line
async function compressField(data: any): Promise<any> {
    const buffer = await deflateAsync(JSON.stringify(data))
    return buffer.toString('base64')
}

// eslint-disable-next-line
async function decompressField(data: any): Promise<any> {
    try {
        const buffer = Buffer.from(data, 'base64')
        const inflated = await inflateAsync(buffer)
        return JSON.parse(inflated.toString())
    } catch {
        return null
    }
}

const fieldsToCompress: (keyof JWT)[] = ['permissions', 'memberships', 'user']

export async function compressJwt(token: JWT): Promise<JWT> {
    for (const field of fieldsToCompress) {
        if (field in token) {
            token[field] = await compressField(token[field])
        }
    }

    return token
}

export async function decompressJwt(token: JWT): Promise<JWT | null> {
    for (const field of fieldsToCompress) {
        if (field in token) {
            const decompressedField = await decompressField(token[field])

            if (decompressedField === null) {
                return null
            }

            token[field] = decompressedField
        }
    }

    return token
}
