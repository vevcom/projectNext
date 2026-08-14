import { owIdToPnId, type IdMapper } from './IdMapper'
import { createProgressBar } from './progressBar'
import { ombulStore } from '@/services/ombul/operations'
import { File } from 'node:buffer'
import type { PrismaClient as PrismaClientOw } from '@/prisma-generated-ow-basic/client'
import type { PrismaClient as PrismaClientPn } from '@/prisma-generated-pn-client'
import type { Limits } from './migrationLimits'

/**
 * This function migrates ombul from OW to PN, by creating a new ombul in PN for
 * each ombul in OW, connecting it to its cover image (already migrated by migrateImages,
 * which places any OW image with an Ombul relation into the OMBULCOVERS collection), and
 * fetching the pdf from the old location and storing it via the ombul store.
 * @param pnPrisma - PrismaClientPn
 * @param owPrisma - PrismaClientOw
 * @param imageIdMap - IdMapper - A map of the old and new id's of the images to
 * be used to create correct relations
 */
export default async function migrateOmbul(
    pnPrisma: PrismaClientPn,
    owPrisma: PrismaClientOw,
    imageIdMap: IdMapper,
    limits: Limits,
) {
    const allOmbuls = await owPrisma.ombul.findMany({
        take: limits.ombul ? limits.ombul : undefined,
    })

    const ombuls = allOmbuls.flatMap(ombul => {
        const coverImageId = owIdToPnId(imageIdMap, ombul.ImageId, 'images')
        if (!coverImageId) {
            console.warn(`Ombul "${ombul.title}" (${ombul.year}) has no resolvable cover image, skipping`)
            return []
        }
        return [{ ...ombul, coverImageId }]
    })

    //First fetch pdfs and write them to the store concurrently for speed
    const fetchBar = createProgressBar('Fetching ombul pdfs', ombuls.length)
    const fsLocations = await Promise.all(ombuls.map(async (ombul): Promise<string | null> => {
        const fsLocationOldVev = `${process.env.OW_STORE_URL}/ombul/${ombul.fileName}.pdf/${ombul.originalName}`

        // Get pdf served at old location
        const res = await fetch(fsLocationOldVev, {
            method: 'GET',
        }).catch(() => null)
        if (!res || !res.ok) {
            console.error(`Failed to fetch ombul pdf from ${fsLocationOldVev}`)
            fetchBar.increment()
            return null
        }

        const pdfBuffer = Buffer.from(await res.arrayBuffer())
        const pdfFile = new File([new Uint8Array(pdfBuffer)], ombul.originalName, { type: 'application/pdf' })

        const { fsLocation } = await ombulStore.createFile(pdfFile)
        fetchBar.increment()
        return fsLocation
    }))
    fetchBar.stop()

    const createBar = createProgressBar('Creating ombuls', ombuls.length)
    for (let ombulIdx = 0; ombulIdx < ombuls.length; ombulIdx++) {
        const ombul = ombuls[ombulIdx]
        const fsLocation = fsLocations[ombulIdx]
        if (!fsLocation) {
            createBar.increment()
            continue
        }

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
                        id: ombul.coverImageId
                    }
                },
                paragraph: {
                    create: {}
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
        createBar.increment()
    }
    createBar.stop()
}
