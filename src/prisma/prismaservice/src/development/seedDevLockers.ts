import type { PrismaClient } from '@/generated/pn'

const locationConfig = ["ved EL5", "Kjelleren", "Koopen"]

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

    locationConfig.forEach(async location => {
        for (let i = 0; i < 10; i++) {
            await prisma.locker.upsert({
                where: {
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