import { PrismaClient as PrismaClientPn } from '@/generated/pn'
import { PrismaClient as PrismaClientVeven } from '@/generated/veven'

type IdMapper = {
    vevenId: number
    pnId: number
}[]

/**
 * This function migrates image collections from Veven to PN
 * @param pnPrisma - PrismaClientPn
 * @param vevenPrisma - PrismaClientVeven
 * @returns - IdMapper - A map of the old and new id's of the image collections
 */
export default async function migrateImageCollection(pnPrisma: PrismaClientPn, vevenPrisma: PrismaClientVeven) {
    const imageCollections = await vevenPrisma.imageGroups.findMany()

    const IdMap: IdMapper = []
    for (const imageCollection of imageCollections) {
        const collectionsWithSameName = await pnPrisma.imageCollection.findMany({
            where: {
                name: imageCollection.name
            }
        })

        const name = imageCollection.name + (collectionsWithSameName.length ? `(${collectionsWithSameName.length})` : '')

        const collection = await pnPrisma.imageCollection.upsert({
            where: {
                name: imageCollection.name
            },
            update: {

            },
            create: {
                name,
                description: 'Denne samlingen ble migrert fra Veven',
                createdAt: imageCollection.updatedAt,
                updatedAt: imageCollection.updatedAt,
                //TODO: Link to right committee
            }
        })
        IdMap.push({vevenId: imageCollection.id, pnId: collection.id})
    }
    return IdMap
}