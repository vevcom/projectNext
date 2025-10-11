import '@pn-server-only'
import { defineSubOperation } from '@/services/serviceOperation'
import { cmsParagraphSchemas } from './schemas'
import { z } from 'zod'
import { SpecialCmsParagraph } from '@prisma/client'

const create = defineSubOperation({
    dataSchema: () => cmsParagraphSchemas.create,
    operation: () => async ({ data, prisma }) => await prisma.cmsParagraph.create({ data })
})

export const cmsParagraphOperations = {
    create,

    destroy: defineSubOperation({
        paramsSchema: () => z.object({ id: z.number() }),
        operation: () => async ({ params, prisma }) => {
            await prisma.cmsParagraph.delete({ where: { id: params.id } })
        }
    }),

    readSpecial: defineSubOperation({
        paramsSchema: (specialsAllowedToBeReadFromImplementation: SpecialCmsParagraph[]) => z.object({
            special: z.nativeEnum(SpecialCmsParagraph).refine(
                val => specialsAllowedToBeReadFromImplementation.includes(val), {
                    message: 'Special paragraph cannot be accessed through this implementation'
                }
            )
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
