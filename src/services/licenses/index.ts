import 'server-only'
import { destroy } from './destroy'
import { readAll } from './read'
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
        hasAuther: false,
    }),
} as const
