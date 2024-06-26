import 'server-only'
import { ServerError } from '@/server/error'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'

/**
 * Destroy a visibility. This will also destroy the visibility levels associated with the visibility,
 * to prevent orphaned visibility levels.
 * @param id - The id of the visibility to destroy
 */
export async function destroyVisibility(id: number): Promise<void> {
    const visibility = await prismaCall(() => prisma.visibility.delete({
        where: {
            id
        }
    }))
    if (visibility.specialPurpose) {
        throw new ServerError('BAD PARAMETERS', 'Kan ikke slette en spesiell visibility')
    }
    await Promise.all([
        prismaCall(() => prisma.visibilityLevel.deleteMany({
            where: {
                id: visibility.adminLevelId
            }
        })),
        prismaCall(() => prisma.visibilityLevel.deleteMany({
            where: {
                id: visibility.regularLevelId
            }
        }))
    ])
}
