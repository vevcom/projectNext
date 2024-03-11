'use server'
import { ActionReturn } from "@/actions/Types"
import type { Committee } from "@prisma/client"
import { createPrismaActionError, createZodActionError } from "@/actions/error"
import prisma from "@/prisma"
import { z } from "zod"
import { createCommitteeSchema, createCommitteeSchemaType } from "./schema"

export default async function createCommittee(
    committeeLogoId: number, 
    rawdata: FormData | createCommitteeSchemaType
) : Promise<ActionReturn<Committee>> {
    const parse = createCommitteeSchema.safeParse(rawdata)
        
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