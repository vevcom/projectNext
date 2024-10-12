import 'server-only'
import { CreateUserAuther, ReadUserAuther, UpdateUserAuther } from './Authers'
import { readProfile } from './read'
import { update } from './update'
import { create } from './create'
import { ServiceMethod } from '@/services/ServiceMethod'

export const User = {
    readProfile: ServiceMethod({
        serviceMethodHandler: readProfile,
        hasAuther: true,
        auther: ReadUserAuther,
        withData: false,
        dynamicFields: ({ params }) => ({ username: params.username })
    }),
    update: ServiceMethod({
        serviceMethodHandler: update,
        hasAuther: true,
        auther: UpdateUserAuther,
        withData: true,
        dynamicFields: () => ({})
    }),
    create: ServiceMethod({
        serviceMethodHandler: create,
        hasAuther: true,
        auther: CreateUserAuther,
        withData: true,
        dynamicFields: () => ({}),
    })
} as const
