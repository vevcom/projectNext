import { eventOperations } from '@/services/events/operations'
import type { PrismaClient } from '@prisma/client'

export default async function seedDevEvents(prisma: PrismaClient) {
    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)

    const startDate = new Date()
    startDate.setDate(today.getDate() + 7)
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 1)

    const bedPresTag = await prisma.eventTag.findUniqueOrThrow({
        where: {
            special: 'COMPANY_PRESENTATION'
        }
    })

    const bedpres = await eventOperations.create({
        prisma,
        bypassAuth: true,
        data: {
            name: 'Bedpres med Kongsberg',
            location: 'EL5',
            eventStart: startDate,
            eventEnd: endDate,
            canBeViewdBy: 'ALL',
            takesRegistration: true,
            places: 15,
            registrationStart: today,
            registrationEnd: tomorrow,
            waitingList: true,
            tagIds: [
                bedPresTag.id,
            ],
        }
    })

    await eventOperations.create({
        prisma,
        bypassAuth: true,
        data: {
            name: 'Stresset eksamenslesing',
            location: 'Lesesal',
            eventStart: startDate,
            eventEnd: endDate,
            canBeViewdBy: 'ALL',
            takesRegistration: false,
            waitingList: false,
            registrationStart: today,
            registrationEnd: tomorrow,
            tagIds: [],
        }
    })

    const someUsers = await prisma.user.findMany({
        take: 10,
        select: {
            id: true
        }
    })

    await prisma.eventRegistration.createMany({
        data: someUsers.map(user => ({
            eventId: bedpres.id,
            userId: user.id
        }))
    })
}
