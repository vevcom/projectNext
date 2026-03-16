import type { PrismaClient } from '@/prisma-generated-pn-client'
import type { CabinProduct, CabinProductPrice } from '@/prisma-generated-pn-types'

export default async function seedCabin(prisma: PrismaClient) {
    const products: (Omit<CabinProduct, 'id' > & {
        CabinProductPrice: (Omit<CabinProductPrice, 'id' | 'cabinProductId' | 'pricePeriodId'>)[]
    })[] = [
        {
            name: 'Hele hytta',
            amount: 1,
            type: 'CABIN',
            CabinProductPrice: [
                {
                    description: 'Søn-Tors',
                    cronInterval: '* * 0-4',
                    price: 100000,
                    memberShare: 0,
                },
                {
                    description: 'Helg (>50% Omega)',
                    cronInterval: '* * 5-6',
                    price: 470000 * 0.5,
                    memberShare: 50,
                },
                {
                    description: 'Helg (med Omega)',
                    cronInterval: '* * 5-6',
                    price: 470000 * 0.75,
                    memberShare: 1,
                },
                {
                    description: 'Helg',
                    cronInterval: '* * 5-6',
                    price: 470000,
                    memberShare: 0,
                },
            ]
        },
        {
            name: 'Seng (120cm)',
            amount: 3,
            type: 'BED',
            CabinProductPrice: [{
                description: '',
                cronInterval: '* * *',
                price: 25000,
                memberShare: 0,
            }]
        },
        {
            name: 'Køye seng (90cm)',
            amount: 14,
            type: 'BED',
            CabinProductPrice: [{
                description: '',
                cronInterval: '* * *',
                price: 15000,
                memberShare: 0,
            }]
        }
    ]

    const now = new Date()

    const pricePeriod = await prisma.pricePeriod.create({
        data: {
            validFrom: now
        }
    })

    await Promise.all(products.map(product =>
        prisma.cabinProduct.create({
            data: {
                name: product.name,
                amount: product.amount,
                type: product.type,
                CabinProductPrice: {
                    create: product.CabinProductPrice.map(price => ({
                        ...price,
                        pricePeriodId: pricePeriod.id
                    }))
                }
            }
        })
    ))

    const secondPricePeriod = await prisma.pricePeriod.create({
        data: {
            validFrom: new Date(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate())
        }
    })

    const allProductPrices = await prisma.cabinProductPrice.findMany()
    await Promise.all(allProductPrices.map(price =>
        prisma.cabinProductPrice.create({
            data: {
                ...price,
                id: undefined,
                pricePeriodId: secondPricePeriod.id,
                price: price.price * 1.5
            }
        })
    ))


    await prisma.releasePeriod.create({
        data: {
            releaseTime: now,
            releaseUntil: new Date(now.getUTCFullYear(), now.getUTCMonth() + 2, now.getUTCDate())
        }
    })
    await prisma.releasePeriod.create({
        data: {
            releaseTime: new Date(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate()),
            releaseUntil: new Date(now.getUTCFullYear(), now.getUTCMonth() + 4, now.getUTCDate())
        }
    })
}
