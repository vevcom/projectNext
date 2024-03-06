import { vevenIdToPnId } from './IdMapper'
import { v4 as uuid } from 'uuid'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { writeFile, mkdir } from 'fs/promises'
import type { PrismaClient as PrismaClientVeven } from '@/generated/veven'
import type { PrismaClient as PrismaClientPn } from '@/generated/pn'
import type { IdMapper } from './IdMapper'
import type { Limits } from './migrationLimits'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * This function migrates ombul from Veven to PN, by creating a new ombul in PN for each ombul in Veven,
 * adding the correct relations to the coverimage and fetching the pdf from the old location and storing it in the new location
 * @param pnPrisma - PrismaClientPn
 * @param vevenPrisma - PrismaClientVeven
 * @param imageIdMap - IdMapper - A map of the old and new id's of the images to be used to create correct relations
 */
export default async function migrateOmbul(
    pnPrisma: PrismaClientPn,
    vevenPrisma: PrismaClientVeven,
    imageIdMap: IdMapper,
    limits: Limits,
) {
    const ombuls = await vevenPrisma.ombul.findMany({
        take: limits.ombul ? limits.ombul : undefined,
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

        const fsLocation = `${uuid()}.pdf`

        await mkdir(store, { recursive: true })

        await writeFile(join(store, fsLocation), pdfBuffer)

        return fsLocation
    }))

    for (const ombulIdx in ombuls) {
        const ombul = ombuls[ombulIdx]
        const fsLocation = fsLocations[ombulIdx]

        const coverName = `${ombul.title.split(' ').join('_')}_cover${uuid()}`

        const coverImageId = vevenIdToPnId(imageIdMap, ombul.ImageId)

        const coverImage = await pnPrisma.cmsImage.upsert({
            where: {
                name: coverName,
            },
            update: {

            },
            create: {
                name: coverName,
                image: coverImageId ? {
                    connect: {
                        id: coverImageId
                    }
                } : undefined
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
