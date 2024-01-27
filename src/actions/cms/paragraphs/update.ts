'use server'

import { ActionReturn } from '../../type'
import errorHandeler from '@/prisma/errorHandler'
import prisma from '@/prisma'
import { CmsParagraph } from '@prisma/client'
import { unified } from 'unified'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'

export default async function update(id: number, contentMd: string) : Promise<ActionReturn<CmsParagraph>> {
    //This function expects to get valid md
    try {
        const contentHtml = (await unified()
            .use(remarkParse)
            .use(remarkRehype)
            .use(rehypeFormat)
            .use(rehypeStringify)
            .process(contentMd)).value.toString()
            .replace(/<img[^>]*>/g, 'CANT HAVE IMAGE')
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
            return errorHandeler(error)
        }
    } catch (e) {
        return {
            success: false,
            error: [{
                message: 'Invalid markdown'
            }]
        }
    }
}
