import '@pn-server-only'
import { articleSectionOperations } from './operations'
import { cmsParagraphOperations } from '@/cms/paragraphs/operations'
import { cmsImageOperations } from '@/cms/images/operations'
import { cmsLinkOperations } from '@/cms/links/operations'
import type { articleSectionSchemas } from './schemas'
import type { AutherResult } from '@/auth/auther/Auther'
import type { Prisma } from '@prisma/client'
import type { z } from 'zod'
import type { ArgsAuthGetterAndOwnershipCheck } from '@/services/serviceOperation'

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
export function implementUpdateArticleSection<
    ImplementationParamsSchema extends z.ZodTypeAny
>({
    implementationParamsSchema,
    authorizer,
    ownedCmsArticleSections,
    destroyOnEmpty
}: {
    implementationParamsSchema: ImplementationParamsSchema,
    authorizer: (
        args: Omit<ArgsAuthGetterAndOwnershipCheck<false, ParamsSchema, undefined, ImplementationParamsSchema>, 'data'>
    ) => AutherResult | Promise<AutherResult>,
    ownedCmsArticleSections: (
        args: Omit<ArgsAuthGetterAndOwnershipCheck<false, ParamsSchema, undefined, ImplementationParamsSchema>, 'data'>
    ) => Promise<OwnedArticleSections[]>
    destroyOnEmpty: boolean
}) {
    const ownershipCheckArticleSection = async (
        args: Omit<ArgsAuthGetterAndOwnershipCheck<false, ParamsSchema, undefined, ImplementationParamsSchema>, 'data'>
    ) => {
        const ownedArticleSections = await ownedCmsArticleSections(args)
        const ownedIds = ownedArticleSections.map(section => section.id)
        const ownedNames = ownedArticleSections.map(section => section.name)
        if (args.params.id) return ownedIds.includes(args.params.id)
        if (args.params.name) return ownedNames.includes(args.params.name)
        return false //This should never happen
    }

    const getOwnedIds = async (
        args: Omit<ArgsAuthGetterAndOwnershipCheck<false, ParamsSchema, undefined, ImplementationParamsSchema>, 'data'>
    ) => {
        const ownedArticleSections = await ownedCmsArticleSections(args)
        return {
            paragraphIds: ownedArticleSections.map(section => section.cmsParagraph?.id).filter(id => id !== undefined),
            imageIds: ownedArticleSections.map(section => section.cmsImage?.id).filter(id => id !== undefined),
            linkIds: ownedArticleSections.map(section => section.cmsLink?.id).filter(id => id !== undefined),
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
                return paragraphIds.includes(args.params.id)
            }
        }),
        cmsImage: cmsImageOperations.update.implement({
            implementationParamsSchema,
            authorizer,
            ownershipCheck: async (args) => {
                const { imageIds } = await getOwnedIds(args)
                return imageIds.includes(args.params.id)
            }
        }),
        cmsLink: cmsLinkOperations.update.implement({
            implementationParamsSchema,
            authorizer,
            ownershipCheck: async (args) => {
                const { linkIds } = await getOwnedIds(args)
                return linkIds.includes(args.params.id)
            }
        })
    }
}
