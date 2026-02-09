import { AuthorizerFactory } from './Authorizer'

export const RequireServerOnly = AuthorizerFactory<object, object, 'USER_NOT_REQUIERED_FOR_AUTHORIZED'>(
    ({ session }) => ({ success: false, session })
)

export const ServerOnlyAuthorizer = () => RequireServerOnly.staticFields({}).dynamicFields({})
