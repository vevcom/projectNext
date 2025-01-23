import 'server-only'
import { destroy } from './destroy'
import { readAll } from './read'
import { CreateLicenseAuther, DestroyLicenseAuther, UpdateLicenseAuther } from './Authers'
import { create } from './create'
import { update } from './update'
import { ServiceMethod } from '@/services/ServiceMethod'

export const Licenses = {
    readAll: ServiceMethod({
        withData: false,
        serviceMethodHandler: readAll,
        hasAuther: false,
    }),
    destroy: ServiceMethod({
        withData: false,
        serviceMethodHandler: destroy,
        hasAuther: true,
        auther: DestroyLicenseAuther,
        dynamicFields: () => ({}),
    }),
    create: ServiceMethod({
        withData: true,
        serviceMethodHandler: create,
        hasAuther: true,
        auther: CreateLicenseAuther,
        dynamicFields: () => ({}),
    }),
    update: ServiceMethod({
        withData: true,
        serviceMethodHandler: update,
        hasAuther: true,
        auther: UpdateLicenseAuther,
        dynamicFields: () => ({}),
    })
} as const
