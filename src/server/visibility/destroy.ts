import 'server-only'
import prisma from '@/prisma'
import { prismaCall } from '../prismaCall'

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