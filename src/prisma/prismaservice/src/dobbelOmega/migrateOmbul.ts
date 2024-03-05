import type { PrismaClient as PrismaClientPn } from '@/generated/pn'
import type { PrismaClient as PrismaClientVeven } from '@/generated/veven'
import { v4 as uuid } from 'uuid'

export default async function migrateOmbul(pnPrisma: PrismaClientPn, vevenPrisma: PrismaClientVeven) {
    const ombuls = await vevenPrisma.ombul.findMany()
    for (const ombul of ombuls) {
        const fsLocationOldVev = `${process.env.VEVEN_STORE_URL}/ombul/${ombul.fileName}/${ombul.originalName}`

        // Get pdf served at old location
        const res = await fetch(fsLocationOldVev, {
            method: 'GET',
        })
        const pdf = await res.blob()
        console.log(res)

        const fsLocation = uuid()

        const coverName = ombul.title.split(' ').join('_') + '_cover' + uuid()
        const coverImage = await pnPrisma.cmsImage.upsert({
            where: {
                name: coverName,
            },
            update: {

            },
            create: {
                name: coverName,
            }
        })

        const ombulsWithSameYearAndName = await pnPrisma.ombul.findMany({
            where: {
                name: ombul.title,
                year: ombul.year || 1919
            }
        })

        const name = ombul.title + (ombulsWithSameYearAndName.length > 0 ? ` (${ombulsWithSameYearAndName.length + 1})` : '')

        await pnPrisma.ombul.upsert({
            where: {
                id: ombul.id
            },
            update: {
               
            },
            create: {
                coverImage: {
                    connect: {
                        id: coverImage.id
                    }
                },
                name,
                description: ombul.lead,
                createdAt: ombul.createdAt,
                updatedAt: ombul.updatedAt,
                year: ombul.year || 1919,
                issueNumber: ombul.number,
                fsLocation,
            }
        })
    }
}
