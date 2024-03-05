import type { PrismaClient as PrismaClientPn } from '@/generated/pn'
import type { PrismaClient as PrismaClientVeven } from '@/generated/veven'

export default async function migrateOmbul(pnPrisma: PrismaClientPn, vevenPrisma: PrismaClientVeven) {
    const ombuls = await vevenPrisma.ombul.findMany()
    Promise.all(ombuls.map(async (ombul) => {
        const fsLocation = ''

        return pnPrisma.ombul.upsert({
            where: {
                id: ombul.id
            },
            update: {
               
            },
            create: {
                id: ombul.id,
                name: ombul.title,
                description: ombul.lead,
                createdAt: ombul.createdAt,
                updatedAt: ombul.updatedAt,
                year: ombul.year || 1919,
                issueNumber: ombul.number,
                fsLocation
            }
        })
    }))
}
