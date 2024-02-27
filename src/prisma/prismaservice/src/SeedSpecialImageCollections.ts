import { PrismaClient, SpecialCollection } from "@prisma/client";

export default async function SeedSpecialImageCollections(prisma : PrismaClient) {
    let special : SpecialCollection
    for (special in SpecialCollection) {
        await prisma.imageCollection.upsert({
            where: {
                name: special
            },
            update: {

            },
            create: {
                name: special,
                special: special
            }
        })
    }
}