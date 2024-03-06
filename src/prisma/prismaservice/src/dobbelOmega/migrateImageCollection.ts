import { PrismaClient as PrismaClientPn } from '@/generated/pn'
import { PrismaClient as PrismaClientVeven } from '@/generated/veven'

export default async function migrateImageCollection(pnPrisma: PrismaClientPn, vevenPrisma: PrismaClientVeven) {
    const imageCollections = await vevenPrisma.imageGroups.findMany()

    await Promise.all(imageCollections.map(async (imageCollection) => {
        pnPrisma.imageCollection.upsert({
            where: {
                name: imageCollection.name
            },
            update: {

            },
            create: {
                id: imageCollection.id,
                name: imageCollection.name,
                description: 'Denne samlingen ble migrert fra Veven',
                createdAt: imageCollection.updatedAt,
                updatedAt: imageCollection.updatedAt,
                //TODO: Link to right committee
            }
        })
    }))
}