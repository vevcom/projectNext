import 'server-only'
import { apiHandler } from '@/api/apiHandler'
import { createUser } from '@/services/users/create'

export const POST = apiHandler({
    serviceMethod: createUser,
})
