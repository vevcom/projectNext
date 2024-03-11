'use server'
import { ActionReturn } from "@/actions/Types"
import type { Committee } from "@prisma/client"
import { createPrismaActionError, createZodActionError } from "@/actions/error"
import prisma from "@/prisma"
import { z } from "zod"

export default async function create(committeeLogoId : number, rawdata : FormData) : Promise<ActionReturn<Committee>> {
    const schema = z.object({
        name : z.string().min(2, "Kommiteenavn må minst ha 2 karakterer").max(15, "Kommiteenavn kan maks ha 15 karakterer")
    })
    const parse = schema.safeParse({
        name : rawdata.get("name")
    })
        
    if (!parse.success) return createZodActionError(parse)

    const { name } = parse.data

    try {
        const committee = await prisma.committee.create({
            data: {
                name,
                logoImage: {
                    connect: {
                        id: committeeLogoId
                    }
                }
            },
        })
        
        return { success: true, data: committee }
    } catch (error) {
        return createPrismaActionError(error)
    }
}