import 'server-only'
import { prismaCall } from '../prismaCall'
import { Admissions } from '@prisma/client'



export async function readAllAdmissions(): Promise<Admissions[]> {
    return await prismaCall(() => prisma.admissions.findMany())
}

export async function readAdmission(id: number): Promise<Admissions> {
    return await prismaCall(() => prisma.admissions.findUniqueOrThrow({
        where: {
            id,
        }
    }))
}