import type { PrismaClient } from '@/prisma-generated-pn-client'

const buildings = ['G-Blokk', 'Test-Blokk']
const floors = [1, 2, 3]
const numLockers = 10
const maxNumber = 10

export default async function seedDevLockers(prisma: PrismaClient) {
    await Promise.all(buildings.map(building => Promise.all(floors.map(floor => prisma.lockerLocation.upsert({
        where: {
            building_floor: {
                building,
                floor
            }
        },
        update: {
            building,
            floor
        },
        create: {
            building,
            floor
        }
    })))))


    await Promise.all(buildings.map((building) => Promise.all(floors.map(async (floor) => {
        for (let i = 0; i < numLockers; i++) {
            await prisma.locker.create({
                data: {
                    building,
                    floor
                }
            })
        }
    }))))

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    for (let i = 1; i < maxNumber; i++) {
        await prisma.lockerReservation.create({
            data: {
                lockerId: i,
                userId: i,
                endDate: tomorrow
            }
        })
    }

    await prisma.lockerReservation.create({
        data: {
            lockerId: maxNumber,
            userId: maxNumber,
            endDate: null
        }
    })
}
