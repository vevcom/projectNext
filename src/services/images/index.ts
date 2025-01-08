import 'server-only'
import { create, createBad, createMany } from './create'
import { ServiceMethod } from '@/services/ServiceMethod'

export const Images = {
    create: ServiceMethod({
        withData: true,
        serviceMethodHandler: create,
        hasAuther: false // TODO: add auth - visibilty
    }),
    createMany: ServiceMethod({
        withData: true,
        serviceMethodHandler: createMany,
        hasAuther: false // TODO: add auth - visibilty
    }),
    createBad: ServiceMethod({
        withData: false,
        serviceMethodHandler: createBad,
        hasAuther: false // TODO: add auth - visibilty
    })
} as const
