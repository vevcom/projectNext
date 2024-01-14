'use server'
import errorHandeler from "@/prisma/errorHandler"
import { Paragraph } from "@prisma/client"
import { ActionReturn } from "../type"

export default async function read(name: string) : Promise<ActionReturn<Paragraph>> {
    try {
        const paragraph = await prisma.paragraph.findUnique({
            where: {
            name
            }
        })
    } catch (error) {
        return errorHandeler(error)
    }
    return {
        success: true,
        data: paragraph
    }
}