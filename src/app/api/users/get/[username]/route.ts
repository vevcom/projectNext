import { apiHandler } from '@/api/apiHandler'
import { userMethods } from '@/services/users/methods'

export const GET = apiHandler({
    serviceMethod: userMethods.readProfile,
    params: (rawparams: {username: string}) => ({ username: rawparams.username })
})

export const PATCH = apiHandler({
    serviceMethod: userMethods.update,
    params: (rawparams: { username: string }) => ({ username: rawparams.username })
})
