import 'server-only'
import { readUser } from '@/server/users/read'
import { verifyJWT } from '@/auth/jwt'
import { ServerError } from '@/server/error'


export async function verifyVerifyEmailToken(token: string): Promise<{
    userId: number,
    email: string,
}> {
    const payload = verifyJWT(token, 'verifyemail')

    if (payload.sub && payload.email && payload.iat) {
        const userId = Number(payload.sub)
        const email = String(payload.email)

        const iat = new Date(payload.iat * 1000)

        const user = await readUser({
            id: userId,
        })

        if (iat < user.updatedAt) {
            throw new ServerError('JWT INVALID', 'The user has changed since the token was generated.')
        }

        return {
            userId,
            email,
        }
    }

    throw new ServerError('JWT INVALID', 'The JWT does not contain the mandatory fields')
}
