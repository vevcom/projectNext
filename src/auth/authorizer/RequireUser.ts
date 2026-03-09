import { AuthorizerFactory } from './Authorizer'

export const RequireUser = AuthorizerFactory<
    Record<string, never>,
    Record<string, never>,
    'USER_REQUIERED_FOR_AUTHORIZED'
>(({ session }) => (session.user ?
    { success: true, session } :
    { success: false, session, errorMessage: 'Du må være innlogget for å få tilgang' }
))
