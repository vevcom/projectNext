import 'server-only'
import { create } from './create'
import { CreateEventTagAuther, UpdateEventTagAuther } from './Authers'
import { read, readAll } from './read'
import { update } from './update'
import { ServiceMethod } from '@/services/ServiceMethod'

export const EventTags = {
    create: ServiceMethod({
        hasAuther: true,
        auther: CreateEventTagAuther,
        dynamicFields: () => ({}),
        withData: true,
        serviceMethodHandler: create,
    }),
    update: ServiceMethod({
        hasAuther: true,
        auther: UpdateEventTagAuther,
        dynamicFields: () => ({}),
        withData: true,
        serviceMethodHandler: update,
    }),
    read: ServiceMethod({
        hasAuther: false,
        withData: false,
        serviceMethodHandler: read,
    }),
    readAll: ServiceMethod({
        hasAuther: false,
        withData: false,
        serviceMethodHandler: readAll,
    }),
} as const
