import '@pn-server-only'
import { companyAuth } from './auth'
import { logoIncluder } from './constants'
import { companySchemas } from './schemas'
import { defineOperation } from '@/services/serviceOperation'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'
import { cmsImageOperations } from '@/cms/images/operations'

export const companyOperations = {
    create: defineOperation({
        dataSchema: companySchemas.create,
        authorizer: () => companyAuth.create.dynamicFields({}),
        operation: async ({ prisma, data }) => {
            //TODO: tranaction when createCmsImage is service operation.
            const logo = await cmsImageOperations.create({ data: {}, bypassAuth: true })
            return await prisma.company.create({
                data: {
                    ...data,
                    logoId: logo.id,
                }
            })
        }
    }),
    readPage: defineOperation({
        paramsSchema: readPageInputSchemaObject(
            z.number(),
            z.object({
                id: z.number(),
            }),
            z.object({
                name: z.string().optional(),
            }),
        ),
        authorizer: () => companyAuth.readPage.dynamicFields({}),
        operation: async ({ prisma, params }) => await prisma.company.findMany({
            ...cursorPageingSelection(params.paging.page),
            where: {
                name: {
                    contains: params.paging.details.name,
                    mode: 'insensitive'
                }
            },
            include: logoIncluder,
        })
    }),
    update: defineOperation({
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: companySchemas.update,
        authorizer: () => companyAuth.update.dynamicFields({}),
        operation: async ({ prisma, params: { id }, data }) => {
            await prisma.company.update({
                where: { id },
                data,
            })
        },
    }),
    updateCmsImageLogo: cmsImageOperations.update.implement({
        implementationParamsSchema: z.object({
            companyId: z.number(),
        }),
        authorizer: () => companyAuth.updateCmsImageLogo.dynamicFields({}),
        ownershipCheck: async ({ implementationParams, params, prisma }) =>
            (await prisma.company.findUniqueOrThrow({
                where: { id: implementationParams.companyId },
                select: { logoId: true }
            }))?.logoId === params.id
    }),
    destroy: defineOperation({
        paramsSchema: z.object({
            id: z.number()
        }),
        authorizer: () => companyAuth.destroy.dynamicFields({}),
        operation: async ({ prisma, params: { id } }) => {
            await prisma.company.delete({
                where: {
                    id
                }
            })
        }
    }),
}
