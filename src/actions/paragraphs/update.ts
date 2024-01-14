'use server'

import { Paragraph } from "@prisma/client";
import { ActionReturn } from "../type";
import errorHandeler from "@/prisma/errorHandler";

export default async function update(id: number, content: string) : Promise<ActionReturn<Paragraph>> {
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