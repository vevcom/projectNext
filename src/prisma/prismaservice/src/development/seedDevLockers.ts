import type { PrismaClient } from '@/generated/pn'

const buildings = ["G-Blokk", "Test-Blokk"]
const floors = [1, 2, 3]
const n = 10
const m = 10

export default async function seedOrder(prisma: PrismaClient) {
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
        for (let i = 0; i < n; i++) {
            await prisma.locker.create({
                data: {
                    building,
                    floor 
                }
            })
        }
    }))))

    for (let i = 1; i < m; i++) {
        await prisma.lockerReservation.create({
            data: {
            lockerId: i,
            userId: i,
            }
        })
    }
}