import type { PrismaClient as PrismaClientPn } from '@/generated/pn'
import type { PrismaClient as PrismaClientVeven } from '@/generated/veven'

export default async function migrateOmbul(pnPrisma: PrismaClientPn, vevenPrisma: PrismaClientVeven) {
    const ombuls = await vevenPrisma.ombul.findMany()
    Promise.all(ombuls.map(async (ombul) => {
        const fsLocationOldVev = `${process.env.VEVEN_STORE_URL}/ombul/${ombul.fileName}/${ombul.originalName}`

        // Get pdf served at old location
        const res = await fetch(fsLocationOldVev, {
            method: 'GET',
        })
        const pdf = await res.blob()
        console.log(res)

        const fsLocation = `hei`

        const coverName = ombul.title.split(' ').join('_') + '_cover'
        const coverImage = await pnPrisma.cmsImage.upsert({
            where: {
                name: coverName
            },
            update: {

            },
            create: {
                name: coverName,
            }
        })

        return pnPrisma.ombul.upsert({
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
                name: ombul.title,
                description: ombul.lead,
                createdAt: ombul.createdAt,
                updatedAt: ombul.updatedAt,
                year: ombul.year || 1919,
                issueNumber: ombul.number,
                fsLocation,
            }
        })
    }))
}
