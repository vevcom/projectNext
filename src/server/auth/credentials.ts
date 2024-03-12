import 'server-only'
import prisma from '@/prisma'
import { createActionError, createPrismaActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { SEX } from '@prisma/client'

export async function registerUser(id: number, config: {
    password: string
    email: string
    username: string
    sex: SEX
}): Promise<ActionReturn<null>> {

    try {

        const alredyRegistered = await prisma.user.findUnique({
            where: {
                id
            },
            select: {
                acceptedTerms: true
            }
        })

        if (alredyRegistered?.acceptedTerms !== null) {
            return createActionError('DUPLICATE', 'User already registered')
        }

        await prisma.$transaction([
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
        ])

        return { success: true, data: null }
    } catch (error) {
        return createPrismaActionError(error)
    }
}