import { AutherFactory } from './AutherFactory'

export const RequireUser = AutherFactory<
    'USER_REQUIERED_FOR_AUTHORIZED',
    undefined,
    undefined
>(
    session => {
        if (session.user) {
            return { success: true, session }
        }
        return { success: false as const, session }
    }
)
