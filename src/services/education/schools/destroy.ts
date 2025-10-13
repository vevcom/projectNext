import '@pn-server-only'
import { prismaCall } from '@/services/prismaCall'
import { ServerError } from '@/services/error'
import { prisma } from '@/prisma/client'

export async function destroySchool(id: number): Promise<void> {
    const school = await prismaCall(() => prisma.school.findUniqueOrThrow({
        where: { id },
        select: { standardSchool: true }
    }))
    if (school.standardSchool) throw new ServerError('BAD PARAMETERS', 'Kan ikke slette standard skole')
    await prismaCall(() => prisma.school.delete({ where: { id } }))
}
