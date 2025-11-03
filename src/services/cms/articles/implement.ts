import { articleOperations } from './operations'
import { implementUpdateArticleSectionOperations } from '@/cms/articleSections/implement'
import { cmsImageOperations } from '@/cms/images/operations'
import type { ArgsAuthGetterAndOwnershipCheck, PrismaPossibleTransaction } from '@/services/serviceOperation'
import type { AutherDynamicFieldsBound } from '@/auth/auther/Auther'
import type { Prisma } from '@prisma/client'
import type { articleSchemas } from './schemas'
import type { z } from 'zod'

type ParamsSchema = typeof articleSchemas.params
type OwnedArticle = Prisma.ArticleGetPayload<{
    include: {
        coverImage: true,
        articleSections: {
            include: {
                cmsImage: true,
                cmsParagraph: true,
                cmsLink: true,
            }
        }
    }
}>
/**
 * This utility implements all the needed operations for an article section and
 * the assosiated cms: CmsLink, CmsParagraph, CmsImage
 */
export function implementUpdateArticleOperations<
    const ImplementationParamsSchema extends z.ZodTypeAny
>({
    implementationParamsSchema,
    authorizer,
    ownedArticles,
}: {
    implementationParamsSchema: ImplementationParamsSchema,
    authorizer: (
        args: {
            prisma: PrismaPossibleTransaction<false>,
            implementationParams: z.infer<ImplementationParamsSchema>
        }
    ) => AutherDynamicFieldsBound | Promise<AutherDynamicFieldsBound>,
    ownedArticles: (
        args: {
            prisma: PrismaPossibleTransaction<false>,
            implementationParams: z.infer<ImplementationParamsSchema>
        }
    ) => Promise<OwnedArticle[]>
}) {
    const ownershipCheckArticle = async (
        args: Omit<ArgsAuthGetterAndOwnershipCheck<false, ParamsSchema, undefined, ImplementationParamsSchema>, 'data'>
    ) => {
        const ownedArticleIds = (await ownedArticles(args)).map(article => article.id)
        return ownedArticleIds.includes(args.params.articleId)
    }

    return {
        update: articleOperations.update.implement({
            implementationParamsSchema,
            authorizer,
            ownershipCheck: ownershipCheckArticle
        }),
        addSection: articleOperations.addSection.implement({
            implementationParamsSchema,
            authorizer,
            ownershipCheck: ownershipCheckArticle
        }),
        reorderSections: articleOperations.reorderSections.implement({
            implementationParamsSchema,
            authorizer,
            ownershipCheck: ownershipCheckArticle
        }),
        coverImage: cmsImageOperations.update.implement({
            implementationParamsSchema,
            authorizer,
            ownershipCheck: async (args) => {
                const coverCmsImagesIds = (await ownedArticles(args)).map(article => article.coverImage.id)
                return coverCmsImagesIds.includes(args.params.cmsImageId)
            }
        }),
        articleSections: implementUpdateArticleSectionOperations({
            implementationParamsSchema,
            authorizer,
            ownedArticleSections: async (args) => {
                const ownedArticlesComputed = await ownedArticles(args)
                const ownedArticleSections = ownedArticlesComputed.flatMap(article => article.articleSections)
                return ownedArticleSections
            },
            destroyOnEmpty: true,
        })
    } as const
}
