import type { PrismaClient } from '@prisma/client'

export default async function seedDevOmegaquotes(prisma: PrismaClient) {
    const user = await prisma.user.findFirst()

    if (!user) {
        throw new Error('Failed to seed omegaquotes due to users is existing')
    }

    const berries = ['blåbær', 'bringebær', 'bjørnebær', 'kake', 'multer', 'stikkelsbær', 'jordbær']
    const indexing = ['første', 'andre', 'tredje', 'fjerde', 'femte', 'sjette']

    for (let i = 0; i < 40; i++) {
        const index = (i >= indexing.length) ? `${i + 1}'ende` : indexing[i]

        await prisma.omegaQuote.create({
            data: {
                author: `Den ${index} veveren på bærtur`,
                quote: `Finnes det ${berries[i % berries.length]} her?`,
                userPoster: {
                    connect: {
                        id: user.id
                    }
                }
            }
        })
    }
}
