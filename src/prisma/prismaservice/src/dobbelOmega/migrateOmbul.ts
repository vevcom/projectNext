import type { PrismaClient as PrismaClientPn } from '@/generated/pn'
import type { PrismaClient as PrismaClientVeven } from '@/generated/veven'
import { v4 as uuid } from 'uuid'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFile, mkdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function migrateOmbul(pnPrisma: PrismaClientPn, vevenPrisma: PrismaClientVeven) {
    const ombuls = await vevenPrisma.ombul.findMany({
        include: {
            Images: true
        },
        take: 3 //TODO: remove this
    })

    //First write files concurrently for speed
    const fsLocations = await Promise.all(ombuls.map(async (ombul) => {
        const fsLocationOldVev = `${process.env.VEVEN_STORE_URL}/ombul/${ombul.fileName}.pdf/${ombul.originalName}`

        // Get pdf served at old location
        const res = await fetch(fsLocationOldVev, {
            method: 'GET',
        })
        const pdfBuffer = Buffer.from(await res.arrayBuffer())

        const store = join(__dirname, '..', '..', 'store', 'ombul')

        const fsLocation = uuid() + '.pdf'

        await mkdir(store, { recursive: true })

        await writeFile(join(store, fsLocation), pdfBuffer)

        return fsLocation
    }))

    for (const ombulIdx in ombuls) {
        const ombul = ombuls[ombulIdx]
        const fsLocation = fsLocations[ombulIdx]

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
