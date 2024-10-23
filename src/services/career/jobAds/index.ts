import 'server-only'
import { CreateJobAdAuther, DestroyJobAdAuther, ReadJobAdAuther, UpdateJobAdAuther } from './Authers'
import { read, readActive } from './read'
import { create } from './create'
import { update } from './update'
import { destroy } from './destroy'
import { ServiceMethod } from '@/services/ServiceMethod'

export const JobAds = {
    read: ServiceMethod({
        withData: false,
        hasAuther: true,
        auther: ReadJobAdAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: read,
    }),
    readActive: ServiceMethod({
        withData: false,
        hasAuther: true,
        auther: ReadJobAdAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: readActive,
    }),
    create: ServiceMethod({
        withData: true,
        hasAuther: true,
        auther: CreateJobAdAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: create,
    }),
    update: ServiceMethod({
        withData: true,
        hasAuther: true,
        auther: UpdateJobAdAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: update,
    }),
    destroy: ServiceMethod({
        withData: false,
        hasAuther: true,
        auther: DestroyJobAdAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: destroy,
    }),
} as const
