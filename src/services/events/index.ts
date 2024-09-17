import 'server-only'
import { CreateEventAuther } from './Authers'
import { create } from './create'
import { ServiceMethod } from '@/services/ServiceMethod'
import { readCurrent } from './read'

export const Events = {
    create: ServiceMethod({
        withData: true,
        serviceMethodHandler: create,
        hasAuther: true,
        auther: CreateEventAuther,
        dynamicFields: () => ({})
    }),
    readCurrent: ServiceMethod({
        withData: false,
        serviceMethodHandler: readCurrent,
        hasAuther: false,
    }) 
} as const
