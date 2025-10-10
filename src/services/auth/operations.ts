import { authAuthers } from './authers'
import { authSchemas } from './schemas'
import { userFilterSelection } from '@/services/users/config'
import { userSchemas } from '@/services/users/schemas'
import { sendResetPasswordMail } from '@/services/notifications/email/systemMail/resetPassword'
import { defineOperation } from '@/services/serviceOperation'
import { ServerError } from '@/services/error'
import { userOperations } from '@/services/users/operations'
import { readJWTPayload } from '@/lib/jwt/jwtReadUnsecure'
import { z } from 'zod'

export const authOperations = {

    verifyEmail: defineOperation({
        paramsSchema: z.object({
            token: z.string(),
        }),
        authorizer: ({ params }) => authAuthers.verifyEmail.dynamicFields(params),
        operation: async ({ prisma, params }) => {
            // INFO: Safe to parse unsafe since the auther has verified the token.
            const payload = readJWTPayload(params.token)

            if (!payload.sub || !payload.email || !payload.iat) {
                throw new ServerError('JWT INVALID', 'The JWT does not contain the mandatory fields')
            }

            const userId = Number(payload.sub)
            const email = String(payload.email)

            const iat = new Date(payload.iat * 1000)

            const user = await userOperations.read({
                params: {
                    id: userId,
                },
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
                select: userFilterSelection,
            })
        }
    }),

    verifyResetPasswordToken: defineOperation({
        paramsSchema: z.object({
            token: z.string()
        }),
        authorizer: ({ params }) => authAuthers.resetPassword.dynamicFields(params),
        operation: async ({ prisma, params }) => {
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
    }),

    resetPassword: defineOperation({
        paramsSchema: z.object({
            token: z.string()
        }),
        dataSchema: userSchemas.updatePassword,
        authorizer: ({ params }) => authAuthers.resetPassword.dynamicFields(params),
        operation: async ({ params, data }) => {
            const userId = await authOperations.verifyResetPasswordToken({ params })

            userOperations.updatePassword({
                params: {
                    id: userId,
                },
                data,
                bypassAuth: true,
            })
        }
    }),

    sendResetPasswordEmail: defineOperation({
        dataSchema: authSchemas.sendResetPasswordEmail,
        authorizer: () => authAuthers.sendResetPasswordEmail.dynamicFields({}),
        operation: async ({ data }) => {
            console.log(data)
            try {
                const user = await userOperations.read({
                    params: {
                        email: data.email,
                    },
                    bypassAuth: true,
                })

                sendResetPasswordMail(user.email)
            } catch (err) {
                console.log(err)
                return data.email
            }

            return data.email
        }
    }),
}
