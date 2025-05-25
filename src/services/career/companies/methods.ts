import '@pn-server-only'
import { CompanySchemas } from './schemas'
import { CompanyAuthers } from './authers'
import { CompanyConfig } from './config'
import { createCmsImage } from '@/services/cms/images/create'
import { ServiceMethod } from '@/services/ServiceMethod'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'

export namespace CompanyMethods {
    export const create = ServiceMethod({
        dataSchema: CompanySchemas.create,
        auther: () => CompanyAuthers.create.dynamicFields({}),
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
    export const readPage = ServiceMethod({
        paramsSchema: readPageInputSchemaObject(
            z.number(),
            z.object({
                id: z.number(),
            }),
            z.object({
                name: z.string().optional(),
            }),
        ),
        auther: () => CompanyAuthers.readPage.dynamicFields({}),
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
    export const update = ServiceMethod({
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: CompanySchemas.update,
        auther: () => CompanyAuthers.update.dynamicFields({}),
        method: async ({ prisma, params: { id }, data }) => {
            await prisma.company.update({
                where: { id },
                data,
            })
        },
    })
    export const destroy = ServiceMethod({
        paramsSchema: z.object({
            id: z.number()
        }),
        auther: () => CompanyAuthers.destroy.dynamicFields({}),
        method: async ({ prisma, params: { id } }) => {
            await prisma.company.delete({
                where: {
                    id
                }
            })
        }
    })
}
