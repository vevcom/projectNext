import '@pn-server-only'
import { articleRealtionsIncluder } from './ConfigVars'
import { defineOperation } from '@/services/serviceOperation'
import { RequireNothing } from '@/auth/auther/RequireNothing'
import { ServerError } from '@/services/error'
import { SpecialCmsArticle } from '@prisma/client'
import { z } from 'zod'
import type { ExpandedArticle } from './types'

export const specialArticleOperations = {
    read: defineOperation({
        paramsSchema: z.object({
            specialCmsArticle: z.nativeEnum(SpecialCmsArticle),
        }),
        authorizer: () => RequireNothing.staticFields({}).dynamicFields({}),
        operation: async ({ prisma, params: { specialCmsArticle } }): Promise<ExpandedArticle> => {
            const article = await prisma.article.findUnique({
                where: {
                    special: specialCmsArticle,
                },
                include: articleRealtionsIncluder
            },
            )
            if (!article) throw new ServerError('NOT FOUND', `Article ${specialCmsArticle} not found`)
            if (!article.coverImage) {
                throw new ServerError(
                    'BAD PARAMETERS',
                    `Article ${specialCmsArticle} has no cover image`
                )
            }
            const ret: ExpandedArticle = {
                ...article,
                coverImage: article.coverImage
            }
            return ret
        }
    })
}
