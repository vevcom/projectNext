import type { PrismaClient } from '@/generated/pn'

const buildings = ["G-Blokk", "Test-Blokk"]
const floors = [1, 2, 3]
const n = 10

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

    try {
        await prisma.lockerResorvation.create({
          data: {
            lockerId: 1,
            userId: 1,
          },
        });
        console.log('LockerReservation created successfully!');
      } catch (error) {
        console.error('Error creating LockerReservation:', error);
      }
}