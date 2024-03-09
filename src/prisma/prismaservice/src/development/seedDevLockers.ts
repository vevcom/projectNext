import type { PrismaClient } from '@/generated/pn'

const locationConfig = ["ved EL5", "Kjelleren", "Koopen"]
const n = 10

export default async function seedOrder(prisma: PrismaClient) {
    await Promise.all(locationConfig.map(location => prisma.lockerLocation.upsert({
        where: {
            location
        },
        update: {
            location
        },
        create: {
            location
        }
    })))

    locationConfig.forEach(async (location, index) => {
        for (let i = 0; i < n; i++) {
            await prisma.locker.upsert({
                where: {
                    id: i + n*index,
                    location
                },
                update: {
                    location
                },
                create: {
                    location
                }
            })
        }
    })
}