import 'server-only'
import { apiHandler } from '@/api/apiHandler'
import { CreateUserAuther } from '@/actions/users/Authers'
import { CreateUser } from '@/services/users/create'

export const POST = apiHandler({
    serviceMethod: CreateUser,
    auther: CreateUserAuther,
    dynamicFields: () => undefined,
    params: () => ({})
})