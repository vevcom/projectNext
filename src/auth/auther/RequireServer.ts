import { AutherFactory } from './Auther'

export const RequireServerOnly = AutherFactory<object, object, 'USER_NOT_REQUIERED_FOR_AUTHORIZED'>(
    ({ session }) => ({ success: false, session })
)

export const ServerOnlyAuther = () => RequireServerOnly.staticFields({}).dynamicFields({})
