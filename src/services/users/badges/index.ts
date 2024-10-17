import 'server-only'
import { create } from './create'
import { ReadBadgeAuther, AdminBadgeAuther} from './Authers'
import {read, readAll} from './read'
import { update } from './update'
import { destroy } from './destroy'
import { ServiceMethod } from '@/services/ServiceMethod'

export const Badges = {
    create: ServiceMethod({
        hasAuther: true,
        auther: AdminBadgeAuther,
        dynamicFields: () => ({}),
        withData: true,
        serviceMethodHandler: create,
    }),
    update: ServiceMethod({
        hasAuther: true,
        auther: AdminBadgeAuther,
        dynamicFields: () => ({}),
        withData: true,
        serviceMethodHandler: update,
    }),
    read: ServiceMethod({
        hasAuther: true,
        auther: ReadBadgeAuther,
        dynamicFields: () => ({}),
        withData: false,
        serviceMethodHandler: read,
    }),
    readAll: ServiceMethod({
        hasAuther: true,
        auther: ReadBadgeAuther,
        dynamicFields: () => ({}),
        withData: false,
        serviceMethodHandler: readAll,
    }),
    destroy: ServiceMethod({
        hasAuther: true,
        auther: AdminBadgeAuther,
        dynamicFields: () => ({}),
        withData: false,
        serviceMethodHandler: destroy
    }),
} as const
