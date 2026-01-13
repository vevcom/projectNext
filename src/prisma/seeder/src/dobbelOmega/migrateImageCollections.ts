import type { IdMapper } from './IdMapper'
import type { PrismaClient as PrismaClientPn } from '@/prisma-generated-pn-client'
import type { PrismaClient as PrismaClientVeven } from '@/prisma-generated-ow-basic/client'

/**
 * This function migrates image collections from Veven to PN
 * @param pnPrisma - PrismaClientPn
 * @param owPrisma - PrismaClientVeven
 * @returns - IdMapper - A map of the old and new id's of the image collections
 */
export default async function migrateImageCollections(pnPrisma: PrismaClientPn, owPrisma: PrismaClientVeven) {
    const imageCollections = await owPrisma.imageGroups.findMany()

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
                //TODO: Link to right committee through visibility
                visibilityRead: {
                    create: {} //Assuming all collections from vevn to be public on migration is probably fine
                },
                visibilityAdmin: {
                    create: {} //TODO: not everyone should be able to update this....
                }
            }
        })
        IdMap.push({ vevenId: imageCollection.id, pnId: collection.id })
    }
    return IdMap
}
