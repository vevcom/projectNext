import 'server-only'
import { create, createSourceless, createMany } from './create'
import { readPage, read, readSpecial } from './read'
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
    createSourceless: ServiceMethod({
        withData: false,
        serviceMethodHandler: createSourceless,
        hasAuther: false // TODO: add auth - visibilty
    }),
    readPage: ServiceMethod({
        withData: false,
        serviceMethodHandler: readPage,
        hasAuther: false // TODO: add auth - visibilty
    }),
    read: ServiceMethod({
        withData: false,
        serviceMethodHandler: read,
        hasAuther: false // TODO: add auth - visibilty
    }),
    readSpecial: ServiceMethod({
        withData: false,
        serviceMethodHandler: readSpecial,
        hasAuther: false // TODO: add auth - visibilty
    }),
} as const
