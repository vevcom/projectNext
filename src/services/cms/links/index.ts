import 'server-only'
import { readSpecial } from './read'
import { ServiceMethod } from '@/services/ServiceMethod'
import { create } from './create'

export const CmsLinks = {
    readSpacial: ServiceMethod({
        withData: false,
        hasAuther: false,
        serviceMethodHandler: readSpecial
    }),
    create: ServiceMethod({
        withData: true,
        hasAuther: false, //TODO: Auth
        serviceMethodHandler: create
    }),
} as const
