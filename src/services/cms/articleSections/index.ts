import 'server-only'
import { validateAndCollapseCmsLinkInArticleSection } from './read'
import { ServiceMethod } from '@/services/ServiceMethod'

export const ArticleSections = {
    validateAndCollapseCmsLinkInArticleSection: ServiceMethod({
        withData: false,
        hasAuther: false,
        serviceMethodHandler: validateAndCollapseCmsLinkInArticleSection
    })
} as const
