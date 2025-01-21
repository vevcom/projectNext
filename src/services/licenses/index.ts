import 'server-only'
import { destroy } from './destroy'
import { readAll } from './read'
import { ServiceMethod } from '@/services/ServiceMethod'
import { CreateLicenseAuther, DestroyLicenseAuther } from './Authers'
import { create } from './create'

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
    })
} as const
