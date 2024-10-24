import 'server-only'
import { create } from './create'
import { CreateThemeAuther, DestroyThemeAuther, UpdateThemeAuther } from './Authers'
import { read, readAll } from './read'
import { update } from './update'
import { destroy } from './destroy'
import { ServiceMethod } from '@/services/ServiceMethod'

export const Themes = {
    create: ServiceMethod({
        hasAuther: true,
        auther: CreateThemeAuther,
        dynamicFields: () => ({}),
        withData: true,
        serviceMethodHandler: create,
    }),
    update: ServiceMethod({
        hasAuther: true,
        auther: UpdateThemeAuther,
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
    destroy: ServiceMethod({
        hasAuther: true,
        auther: DestroyThemeAuther,
        dynamicFields: () => ({}),
        withData: false,
        serviceMethodHandler: destroy
    }),
} as const
