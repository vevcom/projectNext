import { readAll } from './read'
import { ServiceMethod } from '@/services/ServiceMethod'

export const Licenses = {
    readAll: ServiceMethod({
        withData: false,
        serviceMethodHandler: readAll,
        hasAuther: false,
    })
} as const
