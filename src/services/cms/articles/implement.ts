import { articleOperations } from './operations'
import { implementUpdateArticleSectionOperations } from '@/cms/articleSections/implement'
import { cmsImageOperations } from '@/cms/images/operations'
import type {
    ArgsAuthGetterAndOwnershipCheck, AuthorizerGetter, PrismaPossibleTransaction,
} from '@/services/serviceOperation'
import type { AuthorizerDynamicFieldsBound } from '@/auth/authorizer/Authorizer'
import type { Prisma } from '@/prisma-generated-pn-types'
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
    ) => AuthorizerDynamicFieldsBound | Promise<AuthorizerDynamicFieldsBound>,
    ownedArticles: (
        args: {
            prisma: PrismaPossibleTransaction<false>,
            implementationParams: z.infer<ImplementationParamsSchema>
        }
    ) => Promise<OwnedArticle[]>
}) {
    // TypeScript 6 + Zod v4: deferred conditional types prevent the compiler from proving
    // that ArgsAuthGetterAndOwnershipCheck structurally contains { prisma, implementationParams }.
    // These casts are safe at runtime since the arguments are validated before use.
    type ImplementArgs = {
        prisma: PrismaPossibleTransaction<false>,
        implementationParams: z.infer<ImplementationParamsSchema>
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const castAuthorizer = authorizer as AuthorizerGetter<boolean, any, any, ImplementationParamsSchema, undefined>

    const ownershipCheckArticle = async (
        args: Omit<ArgsAuthGetterAndOwnershipCheck<false, ParamsSchema, undefined, ImplementationParamsSchema>, 'data'>
    ) => {
        const ownedArticleIds = (await ownedArticles(args as unknown as ImplementArgs)).map(article => article.id)
        return ownedArticleIds.includes(args.params.articleId)
    }

    return {
        update: articleOperations.update.implement({
            implementationParamsSchema,
            authorizer: castAuthorizer,
            ownershipCheck: ownershipCheckArticle
        }),
        addSection: articleOperations.addSection.implement({
            implementationParamsSchema,
            authorizer: castAuthorizer,
            ownershipCheck: ownershipCheckArticle
        }),
        reorderSections: articleOperations.reorderSections.implement({
            implementationParamsSchema,
            authorizer: castAuthorizer,
            ownershipCheck: ownershipCheckArticle
        }),
        coverImage: cmsImageOperations.update.implement({
            implementationParamsSchema,
            authorizer: castAuthorizer,
            ownershipCheck: async (args) => {
                const ownedArts = await ownedArticles(args as unknown as ImplementArgs)
                const coverCmsImagesIds = ownedArts.map(article => article.coverImage.id)
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
