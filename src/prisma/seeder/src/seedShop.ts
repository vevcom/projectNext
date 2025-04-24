import type { PrismaClient } from '@prisma/client'

export const FRIDGE_NAME = 'Koigeskabet'

export default async function seedShop(prisma: PrismaClient) {
    await prisma.shop.create({
        data: {
            name: FRIDGE_NAME,
            description: 'Her kan du kjøpe snack og drikke fra kjøleskapet på Lophtet.'
        }
    })
}
