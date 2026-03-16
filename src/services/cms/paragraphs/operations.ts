import '@pn-server-only'
import { cmsParagraphSchemas } from './schemas'
import { defineSubOperation } from '@/services/serviceOperation'
import { ServerError } from '@/services/error'
import { SpecialCmsParagraph } from '@/prisma-generated-pn-types'
import { z } from 'zod'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

const create = defineSubOperation({
    dataSchema: () => cmsParagraphSchemas.create,
    operation: () => async ({ data, prisma }) => await prisma.cmsParagraph.create({ data })
})

export const cmsParagraphOperations = {
    create,

    destroy: defineSubOperation({
        paramsSchema: () => z.object({ paragraphId: z.number() }),
        operation: () => async ({ params, prisma }) => {
            const paragraph = await prisma.cmsParagraph.findUniqueOrThrow({ where: { id: params.paragraphId } })
            if (paragraph.special) {
                throw new ServerError('BAD PARAMETERS', 'Special paragraphs cannot be deleted')
            }
            await prisma.cmsParagraph.delete({ where: { id: params.paragraphId } })
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
    }),

    update: defineSubOperation({
        paramsSchema: () => z.object({
            paragraphId: z.number(),
        }),
        dataSchema: () => cmsParagraphSchemas.update,
        operation: () => async ({ params, prisma, data }) => {
            const paragraph = await prisma.cmsParagraph.findUniqueOrThrow({ where: { id: params.paragraphId } })
            if (paragraph.special) {
                throw new ServerError('BAD PARAMETERS', 'Special paragraphs cannot have their meta data updated')
            }
            await prisma.cmsParagraph.update({ where: { id: params.paragraphId }, data })
        }
    }),

    updateContent: defineSubOperation({
        paramsSchema: () => z.object({
            paragraphId: z.number(),
        }),
        dataSchema: () => cmsParagraphSchemas.updateContent,
        operation: () => async ({ params, prisma, data }) => {
            try {
                const contentHtml = (await unified()
                    .use(remarkParse)
                    .use(remarkRehype)
                    .use(rehypeFormat)
                    .use(rehypeStringify)
                    .process(data.markdown)).value.toString()
                    .replace(/<img[^>]*>/g, 'Bilder i markdown er ikke støttet. Bruk det innebygde bildeverktøyet.')
                //TODO: Final sanitization of html!!!
                return await prisma.cmsParagraph.update({
                    where: {
                        id: params.paragraphId
                    },
                    data: {
                        contentMd: data.markdown,
                        contentHtml,
                    }
                })
            } catch {
                throw new ServerError('BAD PARAMETERS', 'Invalid markdown')
            }
        }
    }),

    /**
     * Check if a paragraph with id is special with special atribute
     * in the provided special array
     * This is useful to do ownership checks for services using special paragraphs.
     */
    isSpecial: defineSubOperation({
        paramsSchema: () => z.object({
            paragraphId: z.number(),
            special: z.array(z.nativeEnum(SpecialCmsParagraph))
        }),
        operation: () => async ({ params, prisma }) => {
            const paragraph = await prisma.cmsParagraph.findUnique({
                where: {
                    id: params.paragraphId,
                },
                select: {
                    special: true
                }
            })
            if (!paragraph) throw new ServerError('NOT FOUND', 'Paragraph not found')
            if (!paragraph.special) return false
            return params.special.includes(paragraph.special)
        }
    })
} as const
