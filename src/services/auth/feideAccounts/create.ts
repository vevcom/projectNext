import '@pn-server-only'
import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma/client'
import type { FeideAccount } from '@prisma/client'

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
