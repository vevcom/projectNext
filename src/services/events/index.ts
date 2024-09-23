import 'server-only'
import { CreateEventAuther } from './Authers'
import { create } from './create'
import { ServiceMethod } from '@/services/ServiceMethod'
import { readCurrent, read, readArchivedPage } from './read'
import { update } from './update'
import { destroy } from './destroy'

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
    }),
    readArchivedPage: ServiceMethod({
        withData: false,
        serviceMethodHandler: readArchivedPage,
        hasAuther: false,
    }),
    read: ServiceMethod({
        withData: false,
        serviceMethodHandler: read,
        hasAuther: false, //TODO: Visibility auth bypass event
    }),
    update: ServiceMethod({
        withData: true,
        serviceMethodHandler: update,
        hasAuther: false, // TODO: Visibility auth bypass event
    }),
    destroy: ServiceMethod({
        withData: false,
        serviceMethodHandler: destroy,
        hasAuther: false, // TODO: Visibility auth bypass event
    })
} as const
