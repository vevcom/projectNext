import { AutherFactory } from './Auther'

export const RequireNothing = AutherFactory<object, object, 'USER_NOT_REQUIERED_FOR_AUTHORIZED'>(
    ({ session }) => ({ success: false, session })
)

export const ServerOnlyAuther = () => RequireNothing.staticFields({}).dynamicFields({})
