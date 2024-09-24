import { vevenIdToPnId, type IdMapper } from './IdMapper'
import upsertOrderBasedOnDate from './upsertOrderBasedOnDate'
import type { PrismaClient as PrismaClientPn } from '@/generated/pn'
import type { PrismaClient as PrismaClientVeven } from '@/generated/veven'
import type { Limits } from './migrationLimits'

export default async function migrateEvents(
    pnPrisma: PrismaClientPn,
    vevenPrisma: PrismaClientVeven,
    imageIdMap: IdMapper,
    limits: Limits
) {
    const events = await vevenPrisma.events.findMany({
        take: limits.events ? limits.events : undefined,
        include: {
            Images: true,
            Committees: true,
            EventRegistrations: true,
        }
    })
    Promise.all(events.map(async event => {
        const coverId = vevenIdToPnId(imageIdMap, event.ImageId)
        const coverIage = await pnPrisma.cmsImage.create({
            data: {
                image: coverId ? {
                    connect: {
                        id: coverId,
                    }
                } : undefined
            }
        })
        const paragraph = await pnPrisma.cmsParagraph.create({
            data: {
                contentHtml: event.text || '',
                createdAt: event.createdAt,
                updatedAt: event.updatedAt,
            }
        })

        await pnPrisma.event.create({
            data: {
                name: event.title,
                order: await upsertOrderBasedOnDate(pnPrisma, event.createdAt),
                createdAt: event.createdAt,
                updatedAt: event.updatedAt,
                canBeViewdBy: 'ALL',
                takesRegistration: !!event.places && (event.places > 0),
                places: event.places || 0,
                eventStart: event.eventDate ?? event.createdAt,
                eventEnd: event.eventDate ?? event.createdAt,
                registrationStart: event.registrationStart ?? event.createdAt,
                registrationEnd: event.registrationDeadline ?? event.createdAt,
                coverImageId: coverIage.id,
                cmsParagraphId: paragraph.id,
            }
        })
    }))

    const simpleEvents = await vevenPrisma.simpleEvents.findMany({
        take: limits.events ? limits.events : undefined,
        include: {
            Committees: true,
        }
    })

    Promise.all(simpleEvents.map(async simpleEvent => {
        const coverIage = await pnPrisma.cmsImage.create({
            data: {
                image: undefined
            }
        })
        const paragraph = await pnPrisma.cmsParagraph.create({
            data: {
                contentHtml: simpleEvent.text || '',
                createdAt: simpleEvent.createdAt,
                updatedAt: simpleEvent.updatedAt,
            }
        })
        await pnPrisma.event.create({
            data: {
                name: simpleEvent.title,
                order: await upsertOrderBasedOnDate(pnPrisma, simpleEvent.createdAt),
                createdAt: simpleEvent.createdAt,
                updatedAt: simpleEvent.updatedAt,
                canBeViewdBy: 'ALL',
                takesRegistration: false,
                places: 0,
                eventStart: simpleEvent.eventDate ?? simpleEvent.createdAt,
                eventEnd: simpleEvent.eventDate ?? simpleEvent.createdAt,
                registrationStart: simpleEvent.createdAt,
                registrationEnd: simpleEvent.createdAt,
                coverImageId: coverIage.id,
                cmsParagraphId: paragraph.id,
            }
        })
    }))
}
