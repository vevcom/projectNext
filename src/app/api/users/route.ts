import 'server-only'
import { apiHandler } from '@/api/apiHandler'
import { CreateUserAuther, ReadUserAuther, UpdateUserAuther } from '@/actions/users/Authers'
import { CreateUser } from '@/services/users/create'
import { UpdateUser } from '@/services/users/update'

export const GET = apiHandler({
    serviceMethod: CreateUser,
    auther: ReadUserAuther,
})

export const POST = apiHandler({
    serviceMethod: CreateUser,
    auther: CreateUserAuther,
})

export const PATCH = apiHandler({
    serviceMethod: UpdateUser,
    auther: UpdateUserAuther
})