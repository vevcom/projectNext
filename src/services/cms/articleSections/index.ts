import 'server-only'
import { ServiceMethod } from '@/services/ServiceMethod'
import { validateAndCollapseCmsLinkInArticleSection } from './read'

export const ArticleSections = {
    validateAndCollapseCmsLinkInArticleSection: ServiceMethod({
        withData: false,
        hasAuther: false,
        serviceMethodHandler: validateAndCollapseCmsLinkInArticleSection
    })
} as const