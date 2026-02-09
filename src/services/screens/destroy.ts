import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma-pn-client-instance'

export async function destroyScreen(id: number): Promise<void> {
    await prismaCall(() => prisma.screen.delete({
        where: { id }
    }))
}
