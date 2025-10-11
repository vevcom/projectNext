import { userSchema } from '@/services/users/schemas'

export const authSchemas = {
    sendResetPasswordEmail: userSchema.pick({
        email: true,
    })
}
