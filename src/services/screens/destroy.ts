import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma/client'

export async function destroyScreen(id: number): Promise<void> {
    await prismaCall(() => prisma.screen.delete({
        where: { id }
    }))
}
