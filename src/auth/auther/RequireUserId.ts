import { AutherFactory } from './Auther'

export const RequireUserId = AutherFactory<
    Record<string, never>,
    { userId: number },
    'USER_REQUIERED_FOR_AUTHORIZED'
>(({ session, dynamicFields }) => {
    if (!session.user) {
        return {
            success: false,
            session
        }
    }
    return {
        success: session.user.id === dynamicFields.userId,
        session
    }
})
