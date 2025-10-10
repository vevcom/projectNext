import '@pn-server-only'
import { companyAuthers } from './authers'
import { companySchemas } from './schemas'
import { logoIncluder } from './config'
import { createCmsImage } from '@/services/cms/images/create'
import { serviceMethod } from '@/services/serviceMethod'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'

export const companyMethods = {
    create: serviceMethod({
        dataSchema: companySchemas.create,
        authorizer: () => companyAuthers.create.dynamicFields({}),
        method: async ({ prisma, data }) => {
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
    readPage: serviceMethod({
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
        method: async ({ prisma, params }) => await prisma.company.findMany({
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
    update: serviceMethod({
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: companySchemas.update,
        authorizer: () => companyAuthers.update.dynamicFields({}),
        method: async ({ prisma, params: { id }, data }) => {
            await prisma.company.update({
                where: { id },
                data,
            })
        },
    }),
    destroy: serviceMethod({
        paramsSchema: z.object({
            id: z.number()
        }),
        authorizer: () => companyAuthers.destroy.dynamicFields({}),
        method: async ({ prisma, params: { id } }) => {
            await prisma.company.delete({
                where: {
                    id
                }
            })
        }
    }),
}
