import { EventMethods } from '@/services/events/methods'
import type { PrismaClient } from '@prisma/client'

export default async function seedDevEvents(prisma: PrismaClient) {
    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)

    const startDate = new Date()
    startDate.setDate(today.getDate() + 7)
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 1)

    const bedpres = await EventMethods.create.client(prisma).execute({
        session: null,
        bypassAuth: true,
        data: {
            name: 'Bedpres med Kongsberg',
            eventStart: startDate,
            eventEnd: endDate,
            canBeViewdBy: 'ALL',
            takesRegistration: true,
            places: 15,
            registrationStart: today,
            registrationEnd: tomorrow,
            tagIds: [],
        }
    })

    await EventMethods.create.client(prisma).execute({
        session: null,
        bypassAuth: true,
        data: {
            name: 'Stresset eksamenslesing',
            eventStart: startDate,
            eventEnd: endDate,
            canBeViewdBy: 'ALL',
            takesRegistration: false,
            registrationStart: today,
            registrationEnd: tomorrow,
            tagIds: [],
        }
    })

    const someUsers = prisma.user.findMany({
        take: 10,
        select: {
            id: true
        }
    })

    await prisma.eventRegistration.createMany({
        data: (await someUsers).map(user => ({
            eventId: bedpres.id,
            userId: user.id
        }))
    })
}
