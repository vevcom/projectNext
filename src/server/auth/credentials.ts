import 'server-only'
import { registerUserValidation } from '@/server/users/schema'
import { prismaCall } from '@/server/prismaCall'
import { ServerError } from '@/server/error'
import prisma from '@/prisma'
import type { RegisterUserType } from '@/server/users/schema'

export async function registerUser(id: number, rawdata: RegisterUserType): Promise<null> {
    const data = registerUserValidation.detailedValidate(rawdata)

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
                email: data.email,
                acceptedTerms: new Date(),
                sex: data.sex
            }
        }),
        prisma.credentials.create({
            data: {
                passwordHash: data.password,
                userId: id,
                username: data.username,
            }
        })
    ]))
    return null
}
