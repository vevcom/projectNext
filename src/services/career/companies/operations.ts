import '@pn-server-only'
import { companyAuthers } from './authers'
import { logoIncluder } from './constants'
import { companySchemas } from './schemas'
import { createCmsImage } from '@/services/cms/images/create'
import { defineOperation } from '@/services/serviceOperation'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'

export const companyOperations = {
    create: defineOperation({
        dataSchema: companySchemas.create,
        authorizer: () => companyAuthers.create.dynamicFields({}),
        operation: async ({ prisma, data }) => {
            //TODO: tranaction when createCmsImage is service method.
            const logo = await createCmsImage({ name: uuid() })
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
        authorizer: () => companyAuthers.readPage.dynamicFields({}),
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
        authorizer: () => companyAuthers.update.dynamicFields({}),
        operation: async ({ prisma, params: { id }, data }) => {
            await prisma.company.update({
                where: { id },
                data,
            })
        },
    }),
    destroy: defineOperation({
        paramsSchema: z.object({
            id: z.number()
        }),
        authorizer: () => companyAuthers.destroy.dynamicFields({}),
        operation: async ({ prisma, params: { id } }) => {
            await prisma.company.delete({
                where: {
                    id
                }
            })
        }
    }),
}
