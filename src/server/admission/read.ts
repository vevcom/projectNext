import 'server-only'
import { prismaCall } from '../prismaCall'
import { Admissions } from '@prisma/client'
import prisma from '@/prisma'


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