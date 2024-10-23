import 'server-only'
import { readSpecial } from './read'
import { ServiceMethod } from '@/services/ServiceMethod'
import { create } from './create'
import { destroy } from './destroy'

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
    destroy: ServiceMethod({
        withData: false,
        hasAuther: false, //TODO: Auth
        serviceMethodHandler: destroy
    })
} as const
