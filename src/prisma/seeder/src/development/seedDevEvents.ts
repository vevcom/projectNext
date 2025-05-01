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

    await EventMethods.create.client(prisma).execute({
        session: null,
        bypassAuth: true,
        data: {
            name: 'Bedpres med Kongsberg',
            eventStart: startDate,
            eventEnd: endDate,
            canBeViewdBy: 'ALL',
            takesRegistration: true,
            places: 10,
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
}
