import { ServiceMethod } from '@/services/ServiceMethod'
import 'server-only'
import { validateAndCollapseCmsLinksInArticle } from './read'

export const Articles = {
    validateAndCollapseCmsLinksInArticle: ServiceMethod({
        withData: false,
        hasAuther: false,
        serviceMethodHandler: validateAndCollapseCmsLinksInArticle,
    })
} as const
