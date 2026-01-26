import { AuthorizerFactory } from './Authorizer'

export const RequireServerOnly = AuthorizerFactory(
    ({ session }) => ({ success: false, session })
)

/*
 *To pass this, use `bypassAuth: true`. Method with this auth is mean to only be used internally on the server
*/
export const ServerOnly = () => RequireServerOnly.staticFields({}).dynamicFields({})
