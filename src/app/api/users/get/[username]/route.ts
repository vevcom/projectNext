import { apiHandler } from '@/api/apiHandler'
import { UserMethods } from '@/services/users/methods'

export const GET = apiHandler({
    serviceMethod: UserMethods.readProfile,
    params: (rawparams: {username: string}) => ({ username: rawparams.username })
})

export const PATCH = apiHandler({
    serviceMethod: UserMethods.update,
    params: (rawparams: { username: string }) => ({ username: rawparams.username })
})
