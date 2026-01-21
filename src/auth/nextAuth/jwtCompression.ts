import { deflate, inflate } from 'zlib'
import { promisify } from 'util'
import type { JWT } from 'next-auth/jwt'

// THIS WACKY COMPRESSING AND DECOMPRESSING STUFF IS TEMPORARY
// TO REDUCE JWT SIZE UNTIL WE HAVE EITHER:
// 1) MORE REASONABLE PERMISSIONS ENCODING
// 2) SWITCHED TO DATABASE SESSIONS
// 3) FIX THE JWT TYPE TO SUPPORT COMPRESSION PROPERLY

const deflateAsync = promisify(deflate)
const inflateAsync = promisify(inflate)

// eslint-disable-next-line
async function compressField(data: any): Promise<any> {
    try {
        const buffer = await deflateAsync(JSON.stringify(data))
        return buffer.toString('base64')
    } catch (error) {
        console.error('Failed to compress JWT field: ', error)
        
        return null
    }
}

// eslint-disable-next-line
async function decompressField(data: any): Promise<any> {
    try {
        const buffer = Buffer.from(data, 'base64')
        const inflated = await inflateAsync(buffer)
        return JSON.parse(inflated.toString())
    } catch (error) {
        console.error('Failed to decompress JWT field: ', error)

        return null
    }
}

const fieldsToCompress: (keyof JWT)[] = ['permissions', 'memberships', 'user']

export async function compressJwt(token: JWT | undefined): Promise<JWT | undefined> {
    if (!token) return token

    const compressedJwt = { ...token }

    for (const field of fieldsToCompress) {
        if (field in compressedJwt) {
            compressedJwt[field] = await compressField(compressedJwt[field])
        }
    }

    return compressedJwt
}

export async function decompressJwt(token: JWT): Promise<JWT | null> {
    const decompressedJwt = { ...token }

    for (const field of fieldsToCompress) {
        if (field in decompressedJwt) {
            const decompressedField = await decompressField(decompressedJwt[field])

            if (decompressedField === null) {
                return null
            }

            decompressedJwt[field] = decompressedField
        }
    }

    return decompressedJwt
}
