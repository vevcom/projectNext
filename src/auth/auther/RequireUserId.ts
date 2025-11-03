import { AutherFactory } from './Auther'

export const RequireUserId = AutherFactory<
    Record<string, never>,
    { userId: number },
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
        success: session.user.id === dynamicFields.userId,
        session,
        errorMessage: 'Du har ikke tilgang til denne ressursen'
    }
})
