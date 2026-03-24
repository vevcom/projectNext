import '@pn-server-only'
import { visibilityOperations } from './operations'
import { defineOperation, type PrismaPossibleTransaction } from '@/services/serviceOperation'
import type { AuthorizerDynamicFieldsBound } from '@/auth/authorizer/Authorizer'
import type { Prisma } from '@/prisma-generated-pn-types'
import type { z } from 'zod'
import type { DoubleLevelVisibilityMatrix, VisibilityMatrix } from './types'

type Authorizers<
    ImplementationParamsSchema extends z.ZodTypeAny,
> = {
    readDoubleLevelMatrix: (
        args: {
            prisma: PrismaPossibleTransaction<false>,
            params: z.infer<ImplementationParamsSchema>,
            doubleLevelMatrix: DoubleLevelVisibilityMatrix,
        }
    ) => AuthorizerDynamicFieldsBound | Promise<AuthorizerDynamicFieldsBound>
    updateRegularLevel: (
        args: {
            prisma: PrismaPossibleTransaction<false>,
            implementationParams: z.infer<ImplementationParamsSchema>,
            doubleLevelMatrix: DoubleLevelVisibilityMatrix,
        }
    ) => AuthorizerDynamicFieldsBound | Promise<AuthorizerDynamicFieldsBound>,
    updateAdminLevel: (
        args: {
            prisma: PrismaPossibleTransaction<false>,
            implementationParams: z.infer<ImplementationParamsSchema>,
            doubleLevelMatrix: DoubleLevelVisibilityMatrix,
        }
    ) => AuthorizerDynamicFieldsBound | Promise<AuthorizerDynamicFieldsBound>
}

const prismaInclude = {
    requirements: {
        include: {
            conditions: true
        }
    }
} as const

type ReadVisibilityDoubleLevel<ImplementationParamsSchema extends z.ZodTypeAny> = (
    args: {
        include: typeof prismaInclude,
        prisma: PrismaPossibleTransaction<false>,
        implementationParams: z.infer<ImplementationParamsSchema>
    }
) => Promise<{
    regularLevel: Prisma.VisibilityGetPayload<{ include: typeof prismaInclude }>,
    adminLevel: Prisma.VisibilityGetPayload<{ include: typeof prismaInclude }>
}>

export function implementDoubleLevelVisibilityOperations<
    const ImplementationParamsSchema extends z.ZodTypeAny
>({
    implementationParamsSchema,
    authorizers,
    readDoubleLevel,
}: {
    implementationParamsSchema: ImplementationParamsSchema,
    authorizers: Authorizers<ImplementationParamsSchema>,
    readDoubleLevel: ReadVisibilityDoubleLevel<ImplementationParamsSchema>,
}) {
    const readDoubleLevelMatrixInternal = async ({
        prisma,
        params
    } : {
        prisma: PrismaPossibleTransaction<false>,
        params: z.infer<ImplementationParamsSchema>
    }): Promise<DoubleLevelVisibilityMatrix> => {
        const visibilties = await readDoubleLevel({
            prisma,
            implementationParams: params,
            include: prismaInclude
        })

        return {
            regularLevel: toMatrix(visibilties.regularLevel),
            adminLevel: toMatrix(visibilties.adminLevel)
        }
    }

    return {
        readDoubleLevelMatrixInternal,
        readDoubleLevelMatrix: defineOperation({
            paramsSchema: implementationParamsSchema,
            authorizer: async (args) =>
                authorizers.readDoubleLevelMatrix({
                    prisma: args.prisma,
                    params: args.params,
                    doubleLevelMatrix: await readDoubleLevelMatrixInternal({
                        params: args.params, prisma: args.prisma
                    })
                }),
            operation: async args => readDoubleLevelMatrixInternal({
                params: args.params,
                prisma: args.prisma
            })
        }),
        updateRegularLevel: visibilityOperations.update.implement<ImplementationParamsSchema>({
            implementationParamsSchema,
            authorizer: async (args) =>
                authorizers.updateRegularLevel({
                    prisma: args.prisma,
                    implementationParams: args.implementationParams,
                    doubleLevelMatrix: await readDoubleLevelMatrixInternal({
                        params: args.implementationParams, prisma: args.prisma
                    })
                }),
            ownershipCheck: async ({ params, prisma, implementationParams }) => (await readDoubleLevel({
                include: prismaInclude,
                prisma,
                implementationParams,
            })).regularLevel.id === params.visibilityId
        }),
        updateAdminLevel: visibilityOperations.update.implement<ImplementationParamsSchema>({
            implementationParamsSchema,
            authorizer: async (args) =>
                authorizers.updateAdminLevel({
                    prisma: args.prisma,
                    implementationParams: args.implementationParams,
                    doubleLevelMatrix: await readDoubleLevelMatrixInternal({
                        params: args.implementationParams, prisma: args.prisma
                    })
                }),
            ownershipCheck: async ({ params, prisma, implementationParams }) => (await readDoubleLevel({
                include: prismaInclude,
                prisma,
                implementationParams,
            })).adminLevel.id === params.visibilityId
        })
    } as const
}

function toMatrix(visibility: Prisma.VisibilityGetPayload<{ include: typeof prismaInclude }>): VisibilityMatrix {
    return {
        requirements: visibility.requirements.map(requirement => ({
            conditions: requirement.conditions.map(condition => (
                condition.type === 'ORDER' ? {
                    groupId: condition.groupId,
                    type: condition.type,
                    order: condition.order
                } : {
                    groupId: condition.groupId,
                    type: condition.type,
                }
            ))
        }))
    }
}
