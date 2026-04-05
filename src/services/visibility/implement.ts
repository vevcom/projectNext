import { visibilityOperations } from './operations'
import type {
    ArgsAuthGetterAndOwnershipCheck,
} from '@/services/serviceOperation'
import type { AuthorizerDynamicFieldsBound } from '@/auth/authorizer/Authorizer'
import type { Prisma } from '@/prisma-generated-pn-types'
import type { visibilitySchemas } from './schemas'
import type { z } from 'zod'

type ParamsSchema = typeof visibilitySchemas.params
type OwnedVisibility = Prisma.ArticleGetPayload<{
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
 * This utility implements the read and update operations for visibility
 */
export function implementVisibilityOperations<
    const ImplementationParamsSchema extends z.ZodTypeAny
>({
    implementationParamsSchema,
    authorizers,
    ownedVisibility,
}: {
    implementationParamsSchema: ImplementationParamsSchema,
    authorizers: {
        update: (
            args: Omit<ArgsAuthGetterAndOwnershipCheck<false, z.ZodTypeAny, z.ZodTypeAny, ImplementationParamsSchema>, 'params' | 'data'>
        ) => AuthorizerDynamicFieldsBound | Promise<AuthorizerDynamicFieldsBound>
        read: (
            args: Omit<ArgsAuthGetterAndOwnershipCheck<false, z.ZodTypeAny, z.ZodTypeAny, ImplementationParamsSchema>, 'params' | 'data'>
        ) => AuthorizerDynamicFieldsBound | Promise<AuthorizerDynamicFieldsBound>
    },
    ownedVisibility: (
        args: Omit<ArgsAuthGetterAndOwnershipCheck<false, z.ZodTypeAny, z.ZodTypeAny, ImplementationParamsSchema>, 'params' | 'data'>
    ) => Promise<OwnedVisibility>
}) {
    const ownershipCheckVisibility = async (
        args: Omit<ArgsAuthGetterAndOwnershipCheck<false, ParamsSchema, undefined, ImplementationParamsSchema>, 'data'>
    ) => (await ownedVisibility(args)).id === args.params.visibilityId

    return {
        read: visibilityOperations.read.implement({
            implementationParamsSchema,
            authorizer: authorizers.read,
            ownershipCheck: ownershipCheckVisibility
        }),
        update: visibilityOperations.update.implement({
            implementationParamsSchema,
            authorizer: authorizers.update,
            ownershipCheck: ownershipCheckVisibility
        })
    } as const
}
