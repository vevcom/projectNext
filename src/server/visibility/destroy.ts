import 'server-only'
import prisma from '@/prisma'
import { prismaCall } from '../prismaCall'

/**
 * Destroy a visibility. This will also destroy the visibility levels associated with the visibility,
 * to prevent orphaned visibility levels.
 * @param id - The id of the visibility to destroy
 */
export async function destroyVisibility(id: number) : Promise<void> {
    const visibility = await prismaCall(() => prisma.visibility.delete({
        where: {
            id
        }
    }))
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