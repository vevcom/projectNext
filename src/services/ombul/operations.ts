import '@pn-server-only'
import { defineOperation } from '../serviceOperation'
import { ombulAuth } from './auth'
import { z } from 'zod'
import { ServerError } from '../error'
import { cmsImageOperations } from '@/cms/images/operations'

const read = defineOperation({
    authorizer: () => ombulAuth.read.dynamicFields({}),
    paramsSchema: z.union([
        z.object({
            id: z.number(),
            name: z.undefined().optional(),
            year: z.undefined().optional()
        }),
        z.object({
            id: z.undefined().optional(),
            name: z.string(),
            year: z.number()
        })
    ]),
    operation: ({ params, prisma }) =>
        prisma.ombul.findUniqueOrThrow({
            where: typeof params.id === 'number' ? {
                id: params.id
            } : {
                year_name: {
                    name: params.name,
                    year: params.year
                }
            },
            include: {
                coverImage: {
                    include: {
                        image: true
                    }
                }
            }
        })
})

const readAll = defineOperation({
    authorizer: () => ombulAuth.readAll.dynamicFields({}),
    operation: ({ prisma }) =>
        prisma.ombul.findMany({
            orderBy: [
                { year: 'desc' },
                { issueNumber: 'desc' },
            ],
            include: {
                coverImage: {
                    include: {
                        image: true
                    }
                }
            }
        })
})

const readLatest = defineOperation({
    authorizer: () => ombulAuth.readLatest.dynamicFields({}),
    operation: async ({ prisma }) => {
        const ombul = await prisma.ombul.findMany({
            orderBy: [
                { year: 'desc' },
                { issueNumber: 'desc' },
            ],
            take: 1,
        })
        return ombul[0]
    }
})

const updateCmsCoverImage = cmsImageOperations.update.implement({
    implementationParamsSchema: z.object({
        ombulId: z.number()
    }),
    authorizer: () => ombulAuth.updateCmsCoverImage.dynamicFields({}),
    ownershipCheck: async ({ params, implementationParams }) => {
        const ombul = await read({ params: { id: implementationParams.ombulId } })
        return ombul.coverImage.id === params.id
    }
})

export const ombulOperations = {
    read,
    readAll,
    readLatest,
    updateCmsCoverImage
} as const