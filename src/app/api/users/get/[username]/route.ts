import { apiHandler } from '@/api/apiHandler'
import { userOperations } from '@/services/users/operations'

export const GET = apiHandler({
    serviceMethod: userOperations.readProfile,
    params: (rawparams: {username: string}) => ({ username: rawparams.username })
})

export const PATCH = apiHandler({
    serviceMethod: userOperations.update,
    params: (rawparams: { username: string }) => ({ username: rawparams.username })
})
