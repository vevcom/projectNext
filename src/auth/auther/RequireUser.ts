import { AutherFactory } from './Auther'

export const RequireUser = AutherFactory<
    Record<string, never>,
    Record<string, never>,
    'USER_REQUIERED_FOR_AUTHORIZED'
>(({ session }) => (session.user ? { success: true, session } : { success: false, session }))
