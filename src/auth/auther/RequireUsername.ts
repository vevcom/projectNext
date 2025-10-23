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
            errorMessage: 'Du må være innlogget for å få tilgang'
        }
    }
    return {
        success: session.user?.username === dynamicFields.username,
        session,
        errorMessage: 'Du har ikke tilgang til denne ressursen'
    }
})
