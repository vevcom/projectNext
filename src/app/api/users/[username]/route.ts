import { apiHandler } from '@/api/apiHandler'
import { User } from '@/services/users'

export const GET = apiHandler({
    serviceMethod: User.readProfile,
    params: (rawparams: {username: string}) => ({ username: rawparams.username })
})

export const PATCH = apiHandler({
    serviceMethod: User.update,
    params: (rawparams: { username: string }) => ({ username: rawparams.username })
})
