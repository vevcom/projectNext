import 'server-only'
import { UserMethods } from '../users/methods'
import { ServerError } from '@/services/error'
import { verifyJWT } from '@/jwt/jwt'

export async function verifyResetPasswordToken(token: string): Promise<{
    userId: number
}> {
    const payload = verifyJWT(token, 'resetpassword')

    if (payload.sub && payload.iat) {
        const userId = Number(payload.sub)

        const user = await UserMethods.read.newClient().execute({
            params: { id: userId },
            session: null,
            bypassAuth: true
        })

        if (user.updatedAt <= new Date(payload.iat * 1000)) {
            return {
                userId,
            }
        }

        throw new ServerError('JWT INVALID', 'The password has already been changed')
    }

    throw new ServerError('JWT INVALID', 'The forgot password JWT is not valid')
}
