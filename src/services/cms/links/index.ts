import 'server-only'
import { ServiceMethod } from '@/services/ServiceMethod'
import { readSpecial } from './read'

export const CmsLinks = {
    readSpacial: ServiceMethod({
        withData: false,
        hasAuther: false,
        serviceMethodHandler: readSpecial
    })
} as const