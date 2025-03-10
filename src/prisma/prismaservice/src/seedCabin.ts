import type { CabinProduct, CabinProductPrice, PrismaClient } from '@/generated/pn'

export default async function seedCabin(prisma: PrismaClient) {
    const products: (Omit<CabinProduct, 'id'> & {
        CabinProductPrice: (Omit<CabinProductPrice, 'id' | 'cabinProductId' | 'groupId'> & { groupId?: number })[]
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
                    validFrom: new Date(),
                    omegaShare: 0,
                },
                {
                    description: 'Helg (>50% Omega)',
                    cronInterval: '* * 5-6',
                    price: 470000 * 0.5,
                    validFrom: new Date(),
                    omegaShare: 50,
                },
                {
                    description: 'Helg (med Omega)',
                    cronInterval: '* * 5-6',
                    price: 470000 * 0.75,
                    validFrom: new Date(),
                    omegaShare: 1,
                },
                {
                    description: 'Helg',
                    cronInterval: '* * 5-6',
                    price: 470000,
                    validFrom: new Date(),
                    omegaShare: 0,
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
                validFrom: new Date(),
                omegaShare: 0,
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
                validFrom: new Date(),
                omegaShare: 0,
            }]
        }
    ]

    await Promise.all(products.map(product =>
        prisma.cabinProduct.create({
            data: {
                name: product.name,
                amount: product.amount,
                type: product.type,
                CabinProductPrice: {
                    create: product.CabinProductPrice
                }
            }
        })
    ))

    const now = new Date()

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
