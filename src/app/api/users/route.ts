import 'server-only'
import { apiHandler } from '@/api/apiHandler'
import { ReadUserAuther } from '@/actions/users/Authers'
import { CreateUser } from '@/services/users/create'

export const GET = apiHandler({
    serviceMethod: CreateUser,
    auther: ReadUserAuther,
})
