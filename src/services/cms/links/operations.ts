import '@pn-server-only'
import { cmsLinkSchemas } from './schemas'
import { ServerOnly } from '@/auth/auther/ServerOnly'
import { defineOperation, defineSubOperation } from '@/services/serviceOperation'
import logger from '@/lib/logger'
import { ServerError } from '@/services/error'
import { z } from 'zod'
import { SpecialCmsLink } from '@prisma/client'

const create = defineOperation({
    authorizer: ServerOnly,
    dataSchema: cmsLinkSchemas.create,
    operation: ({ data, prisma }) =>
        prisma.cmsLink.create({
            data
        })
})

export const cmsLinkOperations = {
    create,

    destroy: defineOperation({
        authorizer: ServerOnly,
        paramsSchema: z.object({
            id: z.number()
        }),
        operation: async ({ params, prisma }) => {
            const cmsLink = await prisma.cmsLink.findUniqueOrThrow({
                where: {
                    id: params.id
                }
            })
            if (cmsLink.special) throw new ServerError('BAD PARAMETERS', 'Cannot delete special CMS link')
            await prisma.cmsLink.delete({
                where: {
                    id: params.id
                }
            })
        }
    }),

    update: defineSubOperation({
        paramsSchema: () => z.object({
            id: z.number()
        }),
        dataSchema: () => cmsLinkSchemas.update,
        operation: () => ({ prisma, params, data }) =>
            prisma.cmsLink.update({
                where: {
                    id: params.id
                },
                data: {
                    ...data,
                    url: data.url ?? './'
                }
            })
    }),

    readSpecial: defineSubOperation({
        paramsSchema: () => z.object({
            special: z.nativeEnum(SpecialCmsLink),
        }),
        operation: () => async ({ prisma, params: { special } }) => {
            const cmsLink = await prisma.cmsLink.findUnique({
                where: { special }
            })
            if (!cmsLink) {
                logger.error(`Could not find special cms link with special ${special} - creating it!`)
                return await create({ data: { special, url: './', text: 'Default text' } })
            }
            return cmsLink
        }
    }),

    /**
     * Check if a link with id is special with special atribute
     * in the provided special array
     * This is useful to do ownership checks for services using special links.
     */
    isSpecial: defineOperation({
        authorizer: ServerOnly,
        paramsSchema: z.object({
            id: z.number(),
            special: z.array(z.nativeEnum(SpecialCmsLink))
        }),
        operation: async ({ params, prisma }) => {
            const link = await prisma.cmsLink.findUnique({
                where: {
                    id: params.id,
                },
                select: {
                    special: true
                }
            })
            if (!link) throw new ServerError('NOT FOUND', 'Link not found')
            if (!link.special) return false
            return params.special.includes(link.special)
        }
    })
} as const
