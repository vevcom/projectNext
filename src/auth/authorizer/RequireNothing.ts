import { AuthorizerFactory } from './Authorizer'

export const RequireNothing = AuthorizerFactory<object, object, 'USER_NOT_REQUIERED_FOR_AUTHORIZED'>(
    ({ session }) => ({ success: true, session })
)
