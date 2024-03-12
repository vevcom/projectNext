'use server'

import { createActionError, createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import { unified } from 'unified'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import type { CmsParagraph } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function updateCmsParagraph(id: number, contentMd: string): Promise<ActionReturn<CmsParagraph>> {
    //This function expects to get valid md
    try {
        const contentHtml = (await unified()
            .use(remarkParse)
            .use(remarkRehype)
            .use(rehypeFormat)
            .use(rehypeStringify)
            .process(contentMd)).value.toString()
            .replace(/<img[^>]*>/g, 'Bilder i markdown er ikke støttet. Bruk det innebygde bildeverktøyet.')
        try {
            const paragraph = await prisma.cmsParagraph.update({
                where: {
                    id
                },
                data: {
                    contentMd,
                    contentHtml,
                }
            })
            return {
                success: true,
                data: paragraph
            }
        } catch (error) {
            return createPrismaActionError(error)
        }
    } catch (e) {
        return createActionError('BAD PARAMETERS', 'Invalid markdown')
    }
}
