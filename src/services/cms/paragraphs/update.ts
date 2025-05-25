import '@pn-server-only'
import prisma from '@/prisma'
import { prismaCall } from '@/services/prismaCall'
import { ServerError } from '@/services/error'
import { unified } from 'unified'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import type { CmsParagraph } from '@prisma/client'

/**
 * A function to update the content of a paragraph. Takes markdown and sets both md and html content.
 * @param id - id of the paragraph to update
 * @param contentMd - new content in markdown
 * @returns
 */
export async function updateCmsParagraphContents(id: number, contentMd: string): Promise<CmsParagraph> {
    try {
        const contentHtml = (await unified()
            .use(remarkParse)
            .use(remarkRehype)
            .use(rehypeFormat)
            .use(rehypeStringify)
            .process(contentMd)).value.toString()
            .replace(/<img[^>]*>/g, 'Bilder i markdown er ikke støttet. Bruk det innebygde bildeverktøyet.')
        return await prismaCall(() => prisma.cmsParagraph.update({
            where: {
                id
            },
            data: {
                contentMd,
                contentHtml,
            }
        }))
    } catch {
        throw new ServerError('BAD PARAMETERS', 'Invalid markdown')
    }
}
