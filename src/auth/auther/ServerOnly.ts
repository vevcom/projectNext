import { AutherFactory } from './Auther'

export const RequireServerOnly = AutherFactory(
    ({ session }) => ({ success: false, session })
)

// To pass this auto, use `bypassAuth: true`. Method with this auth is mean to only be used internally on the server
export const ServerOnly = () => RequireServerOnly.staticFields({}).dynamicFields({})
