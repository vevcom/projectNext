import { AutherFactory } from './Auther'

export const RequireUsername = AutherFactory<
    Record<string, never>,
    { username: string },
    'USER_REQUIERED_FOR_AUTHORIZED'
>(({ session, dynamicFields }) => {
    if (!session.user) {
        return {
            success: false,
            session,
        }
    }
    return {
        success: session.user?.username === dynamicFields.username,
        session,
    }
})
