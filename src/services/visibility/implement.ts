import { visibilityOperations } from './operations'
import type {
    ArgsAuthGetterAndOwnershipCheck, AuthorizerGetter, PrismaPossibleTransaction,
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
            args: {
                prisma: PrismaPossibleTransaction<false>,
                implementationParams: z.infer<ImplementationParamsSchema>
            }
        ) => AuthorizerDynamicFieldsBound | Promise<AuthorizerDynamicFieldsBound>
        read: (
            args: {
                prisma: PrismaPossibleTransaction<false>,
                implementationParams: z.infer<ImplementationParamsSchema>
            }
        ) => AuthorizerDynamicFieldsBound | Promise<AuthorizerDynamicFieldsBound>
    },
    ownedVisibility: (
        args: {
            prisma: PrismaPossibleTransaction<false>,
            implementationParams: z.infer<ImplementationParamsSchema>
        }
    ) => Promise<OwnedVisibility>
}) {
    // TypeScript 6 + Zod v4: deferred conditional types prevent the compiler from proving
    // that ArgsAuthGetterAndOwnershipCheck structurally contains { prisma, implementationParams }.
    // These casts are safe at runtime since the arguments are validated before use.
    type ImplementArgs = {
        prisma: PrismaPossibleTransaction<false>,
        implementationParams: z.infer<ImplementationParamsSchema>
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type CastAuthorizer = AuthorizerGetter<false, any, any, ImplementationParamsSchema, undefined>

    const ownershipCheckVisibility = async (
        args: Omit<ArgsAuthGetterAndOwnershipCheck<false, ParamsSchema, undefined, ImplementationParamsSchema>, 'data'>
    ) => (await ownedVisibility(args as unknown as ImplementArgs)).id === args.params.visibilityId

    return {
        read: visibilityOperations.read.implement({
            implementationParamsSchema,
            authorizer: authorizers.read as unknown as CastAuthorizer,
            ownershipCheck: ownershipCheckVisibility
        }),
        update: visibilityOperations.update.implement({
            implementationParamsSchema,
            authorizer: authorizers.update as unknown as CastAuthorizer,
            ownershipCheck: ownershipCheckVisibility
        })
    } as const
}
