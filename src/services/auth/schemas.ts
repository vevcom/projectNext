import { UserSchemas } from '@/services/users/schemas'

export namespace AuthSchemas {

    export const sendResetPasswordEmail = UserSchemas.fields.pick({
        email: true,
    })
}
