import '@pn-server-only'
import { defineSubOperation } from '@/services/serviceOperation'
import { cmsParagraphSchemas } from './schemas'
import { z } from 'zod'
import { SpecialCmsParagraph } from '@prisma/client'
import { ServerError } from '@/services/error'

const create = defineSubOperation({
    dataSchema: () => cmsParagraphSchemas.create,
    operation: () => async ({ data, prisma }) => await prisma.cmsParagraph.create({ data })
})

export const cmsParagraphOperations = {
    create,

    destroy: defineSubOperation({
        paramsSchema: () => z.object({ id: z.number() }),
        operation: () => async ({ params, prisma }) => {
            const paragraph = await prisma.cmsParagraph.findUniqueOrThrow({ where: { id: params.id } })
            if (paragraph.special) {
                throw new ServerError('BAD PARAMETERS', 'Special paragraphs cannot be deleted')
            }
            await prisma.cmsParagraph.delete({ where: { id: params.id } })
        }
    }),

    readSpecial: defineSubOperation({
        paramsSchema: () => z.object({
            special: z.nativeEnum(SpecialCmsParagraph)
        }),
        operation: () => async ({ params, prisma }) => {
            const paragraph = await prisma.cmsParagraph.findUnique({ where: { special: params.special } })
            if (!paragraph) {
                return await create.internalCall({ data: { special: params.special } })
            }
            return paragraph
        }
    })
}
