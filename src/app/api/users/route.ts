import 'server-only'
import { apiHandler } from '@/api/apiHandler'
import { User } from '@/services/users'

export const POST = apiHandler({
    serviceMethod: User.create,
    params: () => undefined
})