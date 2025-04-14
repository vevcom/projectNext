import { AuthAuthers } from './authers'
import { AuthSchemas } from './schemas'
import { sendResetPasswordMail } from '@/services/notifications/email/systemMail/resetPassword'
import { ServiceMethod } from '@/services/ServiceMethod'
import { ServerError } from '@/services/error'
import { UserMethods } from '@/services/users/methods'
import { UserConfig } from '@/services/users/config'
import { readJWTPayload } from '@/lib/jwt/jwtReadUnsecure'
import { UserSchemas } from '@/services/users/schemas'
import { z } from 'zod'

export namespace AuthMethods {

    export const verifyEmail = ServiceMethod({
        paramsSchema: z.object({
            token: z.string(),
        }),
        auther: ({ params }) => AuthAuthers.verifyEmail.dynamicFields(params),
        method: async ({ prisma, params }) => {
            // INFO: Safe to parse unsafe since the auther has verified the token.
            const payload = readJWTPayload(params.token)

            if (!payload.sub || !payload.email || !payload.iat) {
                throw new ServerError('JWT INVALID', 'The JWT does not contain the mandatory fields')
            }

            const userId = Number(payload.sub)
            const email = String(payload.email)

            const iat = new Date(payload.iat * 1000)

            const user = await UserMethods.read.client(prisma).execute({
                params: {
                    id: userId,
                },
                session: null,
                bypassAuth: true,
            })

            if (iat < user.updatedAt) {
                throw new ServerError('JWT INVALID', 'The user has changed since the token was generated.')
            }

            return await prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    emailVerified: new Date(),
                    email,
                },
                select: UserConfig.filterSelection
            })
        }
    })

    export const verifyResetPasswordToken = ServiceMethod({
        paramsSchema: z.object({
            token: z.string()
        }),
        auther: ({ params }) => AuthAuthers.resetPassword.dynamicFields(params),
        method: async ({ prisma, params }) => {
            // INFO: Safe to parse unsafe since the auther has verified the token.
            const payload = readJWTPayload(params.token)

            if (!payload.sub || !payload.iat) {
                throw new ServerError('JWT INVALID', 'The forgot password JWT is not valid')
            }

            const userId = Number(payload.sub)

            const user = await prisma.user.findUniqueOrThrow({
                where: {
                    id: userId,
                },
                select: {
                    credentials: true
                }
            })

            if (user.credentials && user.credentials?.credentialsUpdatedAt > new Date(payload.iat * 1000)) {
                throw new ServerError('JWT INVALID', 'The password has already been changed')
            }

            return userId
        }
    })

    export const resetPassword = ServiceMethod({
        paramsSchema: z.object({
            token: z.string()
        }),
        dataSchema: UserSchemas.updatePassword,
        auther: ({ params }) => AuthAuthers.resetPassword.dynamicFields(params),
        method: async ({ prisma, params, data, session }) => {
            const userId = await verifyResetPasswordToken.client(prisma).executeUnsafe({
                params,
                session,
            })

            UserMethods.updatePassword.client(prisma).execute({
                params: {
                    id: userId,
                },
                data,
                session,
                bypassAuth: true,
            })
        }
    })

    export const sendResetPasswordEmail = ServiceMethod({
        dataSchema: AuthSchemas.sendResetPasswordEmail,
        auther: () => AuthAuthers.sendResetPasswordEmail.dynamicFields({}),
        method: async ({ prisma, data, session }) => {
            console.log(data)
            try {
                const user = await UserMethods.read.client(prisma).executeUnsafe({
                    params: {
                        email: data.email
                    },
                    session,
                    bypassAuth: true,
                })

                sendResetPasswordMail(user.email)
            } catch (err) {
                console.log(err)
                return data.email
            }

            return data.email
        }
    })
}
