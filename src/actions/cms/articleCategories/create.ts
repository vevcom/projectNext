'use server'
import type { ReturnType } from "./ReturnType"
import { ActionReturn } from "@/actions/type"
import prisma from "@/prisma"
import errorHandler from "@/prisma/errorHandler"
import { z } from "zod"

export default async function createArticleCategory(
    rawData: FormData
): Promise<ActionReturn<ReturnType>> {
    const schema = z.object({
        name: z.string().min(2, 'Minmum lengde på 2').max(18, 'Maks lengde på navn er 18').trim(),
        description: z.string().min(5, 'Minimum lengde på en beskrivelse er 5')
            .max(70, 'max 70 karakrerer').or(z.literal('')),
    })
    const parse = schema.safeParse({
        name: rawData.get('name'),
        description: rawData.get('description'),
    })
    if (!parse.success) {
        return { success: false, error: parse.error.issues }
    }
    const { name, description } = parse.data
    try {
        // TODO: Check for permission to create article category
        const articleCategory = await prisma.articleCategory.create({
            data: {
                name,
                description
            },
            include: {
                articles: true
            },
        })
        return { success: true, data: articleCategory }
    } catch (error) {
        return errorHandler(error)
    }

}