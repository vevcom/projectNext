import 'server-only'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { Admissions } from '@prisma/client'


export async function readAdmissions(query?: {
    archived?: boolean
}): Promise<Admissions[]> {
    return await prismaCall(() => prisma.admissions.findMany({
        where: query,
    }))
}

export async function readAdmission(id: number): Promise<Admissions> {
    return await prismaCall(() => prisma.admissions.findUniqueOrThrow({
        where: {
            id,
        }
    }))
}
