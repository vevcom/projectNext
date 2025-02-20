import 'server-only'
import { companySchemas } from './schemas'
import { companyAuthers } from './authers'
import { companyConfig } from './config'
import { createCmsImage } from '@/services/cms/images/create'
import { ServiceMethod } from '@/services/ServiceMethod'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'

export const companyMethods = {
    create: ServiceMethod({
        dataSchema: companySchemas.create,
        auther: () => companyAuthers.create.dynamicFields({}),
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
    readPage: ServiceMethod({
        paramsSchema: readPageInputSchemaObject(
            z.number(),
            z.object({
                id: z.number(),
            }),
            z.object({
                name: z.string().optional(),
            }),
        ),
        auther: () => companyAuthers.readPage.dynamicFields({}),
        method: async ({ prisma, params }) => await prisma.company.findMany({
            ...cursorPageingSelection(params.paging.page),
            where: {
                name: {
                    contains: params.paging.details.name,
                    mode: 'insensitive'
                }
            },
            include: companyConfig.relationIncluder
        })
    }),
    update: ServiceMethod({
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: companySchemas.update,
        auther: () => companyAuthers.update.dynamicFields({}),
        method: async ({ prisma, params: { id }, data }) => {
            await prisma.company.update({
                where: { id },
                data,
            })
        },
    }),
    destroy: ServiceMethod({
        paramsSchema: z.object({
            id: z.number()
        }),
        auther: () => companyAuthers.destroy.dynamicFields({}),
        method: async ({ prisma, params: { id } }) => {
            await prisma.company.delete({
                where: {
                    id
                }
            })
        }
    })
} as const
