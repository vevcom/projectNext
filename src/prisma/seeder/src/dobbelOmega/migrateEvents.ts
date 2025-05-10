import { vevenIdToPnId, type IdMapper } from './IdMapper'
import upsertOrderBasedOnDate from './upsertOrderBasedOnDate'
import type { PrismaClient as PrismaClientPn } from '@prisma/client'
import type { PrismaClient as PrismaClientVeven } from '@/prisma-dobbel-omega/client'
import type { Limits } from './migrationLimits'
import type { UserMigrator } from './migrateUsers'

export default async function migrateEvents(
    pnPrisma: PrismaClientPn,
    vevenPrisma: PrismaClientVeven,
    imageIdMap: IdMapper,
    userMigrator: UserMigrator,
    limits: Limits
) {
    const events = await vevenPrisma.events.findMany({
        take: limits.events ? limits.events : undefined,
        orderBy: limits.events ? {
            createdAt: 'desc'
        } : undefined,
        include: {
            Images: true,
            Committees: true,
            EventRegistrations: true,
        }
    })

    //Make sure no events have same title and order
    events.forEach((event) => {
        const sameTitle = events.filter(e => e.title === event.title)
        if (sameTitle.length > 1) {
            sameTitle.forEach((e, i) => {
                e.title = `${e.title} (${i + 1})`
            })
        }
    })

    await Promise.all(events.map(async event => {
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

        const order = await upsertOrderBasedOnDate(pnPrisma, event.createdAt)

        const newEvent = await pnPrisma.event.create({
            data: {
                name: event.title,
                order,
                location: event.location,
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
                waitingList: event.waitingList ?? true,
                lead: event.lead,
                extraFields: event.extraFields ?? undefined,
                eventTagEvents: event.company ? {
                    create: {
                        tag: {
                            connect: {
                                special: 'COMPANY_PRESENTATION'
                            }
                        }
                    }
                } : undefined,
                createdById: event.CreatedByUserId ? await userMigrator.getPnUserId(event.CreatedByUserId) : undefined,
            }
        })

        await Promise.all(event.EventRegistrations.map(async registration => {
            const result = await pnPrisma.eventRegistration.create({
                data: {
                    eventId: newEvent.id,
                    company: registration.company,
                    manuallyPaid: registration.manPaid,
                    note: registration.note,
                    extraFieldChoices: registration.extraFieldChoices ?? undefined,
                    userId: registration.UserId ? await userMigrator.getPnUserId(registration.UserId) : undefined,
                }
            })
            if (registration.nameSpecified || registration.emailSpecified) {
                await pnPrisma.contactDetails.create({
                    data: {
                        name: registration.nameSpecified ?? '',
                        email: registration.emailSpecified ?? undefined,
                        EventRegistration: {
                            connect: {
                                id: result.id,
                            }
                        }
                    }
                })
            }
        }))
    }))

    const simpleEvents = await vevenPrisma.simpleEvents.findMany({
        take: limits.events ? limits.events : undefined,
        include: {
            Committees: true,
        }
    })
    //Make sure no events have same title and order
    simpleEvents.forEach((event) => {
        const sameTitle = simpleEvents.filter(e => e.title === event.title)
        if (sameTitle.length > 1) {
            sameTitle.forEach((e, i) => {
                e.title = `${e.title} (${i + 1})`
            })
        }
    })

    await Promise.all(simpleEvents.map(async simpleEvent => {
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

        const order = await upsertOrderBasedOnDate(pnPrisma, simpleEvent.createdAt)

        await pnPrisma.event.create({
            data: {
                name: simpleEvent.title,
                order,
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
                waitingList: false,
            }
        })
    }))
}
