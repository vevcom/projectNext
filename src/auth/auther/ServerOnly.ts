import { AutherFactory } from './Auther'

export const RequireServerOnly = AutherFactory(
    ({ session }) => ({ success: false, session })
)

export const ServerOnly = () => RequireServerOnly.staticFields({}).dynamicFields({})
