
import { FRIDGE_NAME } from '@/src/seedShop'
import type { PrismaClient } from '@/generated/pn'


export default async function seedDevShop(prisma: PrismaClient) {
    const fridge = await prisma.shop.findUnique({
        where: {
            name: FRIDGE_NAME,
        },
    })

    if (fridge === null) {
        throw Error(
            `Could not find a shop with name ${FRIDGE_NAME}. The ${FRIDGE_NAME} shop must be created before seeding products`
        )
    }

    const shopId = fridge.id

    const products: {
        name: string,
        description?: string,
        barcode?: string,
        price: number,
    }[] = [
        {
            name: 'Dahls',
            price: 3000,
        },
        {
            name: 'Hansa',
            price: 3400,
        },
        {
            name: 'Smirnoff ICE',
            price: 4200,
            barcode: '5410316983693'
        },
        {
            name: 'Isbjørn Lite',
            price: 3400,
        },
        {
            name: 'Kakao',
            price: 500,
            barcode: '7622210610416'
        },
        {
            name: 'Crush Cloudy',
            price: 4700,
        },
    ]

    await Promise.all(products.map(product => prisma.product.create({
        data: {
            name: product.name.toUpperCase(),
            description: product.description,
            ShopProduct: {
                create: {
                    price: product.price,
                    shop: {
                        connect: {
                            id: shopId,
                        },
                    },
                },
            },
        },
    })))
}
