import 'server-only'
import { ServiceMethod } from '@/services/ServiceMethod'
import { validateAndCollapseArticleSection } from './read'

export const ArticleSections = {
    validateAndCollapseArticleSection: ServiceMethod({
        withData: false,
        hasAuther: false,
        serviceMethodHandler: validateAndCollapseArticleSection
    })
}