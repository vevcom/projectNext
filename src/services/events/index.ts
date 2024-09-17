import 'server-only'
import { CreateEventAuther } from './Authers'
import { create } from './create'
import { ServiceMethod } from '@/services/ServiceMethod'

export const Events = {
    create: ServiceMethod({
        withData: true,
        serviceMethodHandler: create,
        hasAuther: true,
        auther: CreateEventAuther,
        dynamicFields: () => ({})
    })
} as const
