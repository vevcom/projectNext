import 'server-only'
import { verifyJWT } from '@/auth/jwt'
import { ServerError } from '@/server/error'


export async function verifyVerifyEmailToken(token: string): Promise<{
    userId: number,
    email: string,
}> {
    const payload = verifyJWT(token, 'verifyemail')

    if (payload.sub && payload.email) {
        const userId = Number(payload.sub)
        const email = String(payload.email)

        return {
            userId,
            email,
        }
    }

    throw new ServerError('JWT INVALID', 'The JWT does not contain the mandatory fields')
}
