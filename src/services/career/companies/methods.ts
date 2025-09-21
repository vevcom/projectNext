import '@pn-server-only'
import { CompanySchemas } from './schemas'
import { CompanyAuthers } from './authers'
import { CompanyConfig } from './config'
import { createCmsImage } from '@/services/cms/images/create'
import { serviceMethod } from '@/services/serviceMethod'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'

export namespace CompanyMethods {
    export const create = serviceMethod({
        dataSchema: CompanySchemas.create,
        authorizer: () => CompanyAuthers.create.dynamicFields({}),
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
    })
    export const readPage = serviceMethod({
        paramsSchema: readPageInputSchemaObject(
            z.number(),
            z.object({
                id: z.number(),
            }),
            z.object({
                name: z.string().optional(),
            }),
        ),
        authorizer: () => CompanyAuthers.readPage.dynamicFields({}),
        method: async ({ prisma, params }) => await prisma.company.findMany({
            ...cursorPageingSelection(params.paging.page),
            where: {
                name: {
                    contains: params.paging.details.name,
                    mode: 'insensitive'
                }
            },
            include: CompanyConfig.relationIncluder
        })
    })
    export const update = serviceMethod({
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: CompanySchemas.update,
        authorizer: () => CompanyAuthers.update.dynamicFields({}),
        method: async ({ prisma, params: { id }, data }) => {
            await prisma.company.update({
                where: { id },
                data,
            })
        },
    })
    export const destroy = serviceMethod({
        paramsSchema: z.object({
            id: z.number()
        }),
        authorizer: () => CompanyAuthers.destroy.dynamicFields({}),
        method: async ({ prisma, params: { id } }) => {
            await prisma.company.delete({
                where: {
                    id
                }
            })
        }
    })
}
