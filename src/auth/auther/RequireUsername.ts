import { AutherFactory } from './AutherFactory'

export const RequireUsername = AutherFactory<
    'USER_NOT_REQUIERED_FOR_AUTHORIZED',
    { username: string }
>((session, _: undefined, { username }) => ({
    success: session.user?.username === username,
    session
}))
