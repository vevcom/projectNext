import 'server-only'
import { prismaCall } from '@/server/prismaCall'
import { ServerError } from '@/server/error'
import prisma from '@/prisma'
import type { SEX } from '@prisma/client'

export async function registerUser(id: number, config: {
    password: string
    email: string
    username: string
    sex: SEX
}): Promise<null> {
    const alredyRegistered = await prismaCall(() => prisma.user.findUnique({
        where: {
            id
        },
        select: {
            acceptedTerms: true
        }
    }))
    if (alredyRegistered?.acceptedTerms !== null) throw new ServerError('DUPLICATE', 'User already registered')

    await prismaCall(() => prisma.$transaction([
        prisma.user.update({
            where: {
                id
            },
            data: {
                email: config.email,
                acceptedTerms: new Date(),
                sex: config.sex
            }
        }),
        prisma.credentials.create({
            data: {
                passwordHash: config.password,
                userId: id,
                username: config.username,
            }
        })
    ]))
    return null
}
