import 'server-only'
import { prismaCall } from "@/server/prismaCall"
import { FeideAccount } from "@prisma/client"
import prisma from '@/prisma'

export async function createFeideAccount({
    id,
    accessToken,
    expiresAt,
    issuedAt,
    userId,
    email,
}: FeideAccount): Promise<FeideAccount> {
    return await prismaCall(() => prisma.feideAccount.create({
        data: {
            id,
            accessToken,
            expiresAt,
            issuedAt,
            email,
            user: {
                connect: {
                    id: userId,
                },
            }
        }
    }))
}