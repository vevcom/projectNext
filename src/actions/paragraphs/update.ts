'use server'

import { Paragraph } from "@prisma/client";
import { ActionReturn } from "../type";
import errorHandeler from "@/prisma/errorHandler";
import { unified } from 'unified'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'

export default async function update(id: number, content: string) : Promise<ActionReturn<Paragraph>> {
    //This function expects to get valid md
    try {
        const html = unified()
            .use(remarkParse)
            .use(remarkRehype)
            .use(rehypeFormat)
            .use(rehypeStringify).processSync(content)
        console.log(html)
    } catch (e) {
        console.log(e)
    }
    
    try {
        const paragraph = await prisma.paragraph.update({
            where: { 
                id 
            },
            data: { 
                content 
            }
        })
        return {
            success: true,
            data: paragraph
        }
    } catch (error) {
        return errorHandeler(error)
    }
}