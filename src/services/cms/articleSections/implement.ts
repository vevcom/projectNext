import '@pn-server-only'
import { articleSectionOperations } from './operations'
import { cmsParagraphOperations } from '@/cms/paragraphs/operations'
import { cmsImageOperations } from '@/cms/images/operations'
import { cmsLinkOperations } from '@/cms/links/operations'
import type { articleSectionSchemas } from './schemas'
import type { AutherResult } from '@/auth/auther/Auther'
import type { Prisma } from '@prisma/client'
import type { z } from 'zod'
import type { ArgsAuthGetterAndOwnershipCheck, PrismaPossibleTransaction } from '@/services/serviceOperation'

type ParamsSchema = typeof articleSectionSchemas.params
type OwnedArticleSections = Prisma.ArticleSectionGetPayload<{
    include: {
        cmsImage: true,
        cmsParagraph: true,
        cmsLink: true,
    }
}>
/**
 * This utility implements all the needed update operations for an article section and
 * the assosiated cms: CmsLink, CmsParagraph, CmsImage
 */
export function implementUpdateArticleSectionOperations<
    const ImplementationParamsSchema extends z.ZodTypeAny
>({
    implementationParamsSchema,
    authorizer,
    ownedArticleSections,
    destroyOnEmpty
}: {
    implementationParamsSchema: ImplementationParamsSchema,
    authorizer: (
        args: {
            prisma: PrismaPossibleTransaction<false>,
            implementationParams: z.infer<ImplementationParamsSchema>
        }
    ) => AutherResult | Promise<AutherResult>,
    ownedArticleSections: (
        args: {
            prisma: PrismaPossibleTransaction<false>,
            implementationParams: z.infer<ImplementationParamsSchema>
        }
    ) => Promise<OwnedArticleSections[]>
    destroyOnEmpty: boolean
}) {
    const ownershipCheckArticleSection = async (
        args: Omit<ArgsAuthGetterAndOwnershipCheck<false, ParamsSchema, undefined, ImplementationParamsSchema>, 'data'>
    ) => {
        const ownedArticleSectionsComputed = await ownedArticleSections(args)
        const ownedIds = ownedArticleSectionsComputed.map(section => section.id)
        const ownedNames = ownedArticleSectionsComputed.map(section => section.name)
        if (args.params.articleSectionId) return ownedIds.includes(args.params.articleSectionId)
        if (args.params.articleSectionName) return ownedNames.includes(args.params.articleSectionName)
        return false //This should never happen
    }

    const getOwnedIds = async (
        args: {
            prisma: PrismaPossibleTransaction<false>,
            implementationParams: z.infer<ImplementationParamsSchema>
        }
    ) => {
        const ownedArticleSectionsComputed = await ownedArticleSections(args)
        return {
            paragraphIds: ownedArticleSectionsComputed.map(
                section => section.cmsParagraph?.id).filter(id => id !== undefined),
            cmsImageIds: ownedArticleSectionsComputed.map(section => section.cmsImage?.id).filter(id => id !== undefined),
            linkIds: ownedArticleSectionsComputed.map(section => section.cmsLink?.id).filter(id => id !== undefined),
        }
    }

    return {
        updateArticleSection: articleSectionOperations.update.implement({
            implementationParamsSchema,
            authorizer,
            ownershipCheck: ownershipCheckArticleSection,
        }),
        addPart: articleSectionOperations.addPart.implement({
            implementationParamsSchema,
            authorizer,
            ownershipCheck: ownershipCheckArticleSection,
        }),
        removePart: articleSectionOperations.removePart.implement({
            implementationParamsSchema,
            authorizer,
            ownershipCheck: ownershipCheckArticleSection,
            operationImplementationFields: { destroyOnEmpty }
        }),
        cmsParagraph: cmsParagraphOperations.updateContent.implement({
            implementationParamsSchema,
            authorizer,
            ownershipCheck: async (args) => {
                const { paragraphIds } = await getOwnedIds(args)
                return paragraphIds.includes(args.params.paragraphId)
            }
        }),
        cmsImage: cmsImageOperations.update.implement({
            implementationParamsSchema,
            authorizer,
            ownershipCheck: async (args) => {
                const { cmsImageIds } = await getOwnedIds(args)
                return cmsImageIds.includes(args.params.cmsImageId)
            }
        }),
        cmsLink: cmsLinkOperations.update.implement({
            implementationParamsSchema,
            authorizer,
            ownershipCheck: async (args) => {
                const { linkIds } = await getOwnedIds(args)
                return linkIds.includes(args.params.linkId)
            }
        })
    } as const
}

