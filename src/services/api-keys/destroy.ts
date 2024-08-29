import 'server-only'
import { prismaCall } from '@/services/prismaCall'
import { ServerError } from '@/services/error'
import prisma from '@/prisma'

export async function destroyApiKey(id: number): Promise<void> {
    const apiKey = await prismaCall(() => prisma.apiKey.findUniqueOrThrow({
        where: { id },
        select: { active: true }
    }))
    if (apiKey.active) {
        throw new ServerError('BAD PARAMETERS', 'Du kan ikke slette en aktiv nøkkel - deaktiver den først')
    }

    await prisma.apiKey.delete({
        where: { id }
    })
}
