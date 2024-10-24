import 'server-only'
import { readSpecial } from './read'
import { ServiceMethod } from '@/services/ServiceMethod'

export const CmsLinks = {
    readSpacial: ServiceMethod({
        withData: false,
        hasAuther: false,
        serviceMethodHandler: readSpecial
    })
} as const
