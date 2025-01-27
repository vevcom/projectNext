import { apiHandler } from '@/api/apiHandler'
import { readUserProfile } from '@/services/users/read'
import { updateUser } from '@/services/users/update'

export const GET = apiHandler({
    serviceMethod: readUserProfile,
    params: (rawparams: {username: string}) => ({ username: rawparams.username })
})

export const PATCH = apiHandler({
    serviceMethod: updateUser,
    params: (rawparams: { username: string }) => ({ username: rawparams.username })
})
