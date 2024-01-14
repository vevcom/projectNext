'use server'
import errorHandeler from "@/prisma/errorHandler"
import { Paragraph } from "@prisma/client"
import { ActionReturn } from "../type"
import create from "./create"

export default async function read(name: string) : Promise<ActionReturn<Paragraph>> {
    try {
        const paragraph = await prisma.paragraph.findUnique({
            where: {
            name
            }
        })
        if (paragraph) {
            return {
                success: true,
                data: paragraph
            }
        }
        return create(name)
    } catch (error) {
        return errorHandeler(error)
    }
}