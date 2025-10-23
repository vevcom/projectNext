import { z } from "zod";
import { implementUpdateArticleSectionOperations } from "../articleSections/implement";
import { ArgsAuthGetterAndOwnershipCheck } from "@/services/serviceOperation";
import { AutherResult } from "@/auth/auther/Auther";
import { articleSchemas } from "./schemas";
import { Prisma } from "@prisma/client";
import { articleOperations } from "./operations";
import { cmsImageOperations } from "../images/operations";

type ParamsSchema = typeof articleSchemas.params
type OwnedArticleSections = Prisma.ArticleGetPayload<{
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
 * This utility implements all the needed update operations for an article section and
 * the assosiated cms: CmsLink, CmsParagraph, CmsImage
 */
export function implementUpdateArticleSectionOperations<
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
    return {
        update: articleOperations.update.implement({
            implementationParamsSchema,
            authorizer,
            ownershipCheck: () => true
        }),
        addSection: articleOperations.addSection.implement({
            implementationParamsSchema,
            authorizer,
            ownershipCheck: () => true
        }),
        reorderSections: articleOperations.reorderSections.implement({
            implementationParamsSchema,
            authorizer,
            ownershipCheck: () => true
        }),
        updateCoverImage: cmsImageOperations.update.implement({
            implementationParamsSchema,
            authorizer,
            ownershipCheck: () => true
        })
    } as const
}