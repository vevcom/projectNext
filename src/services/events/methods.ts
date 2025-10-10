import '@pn-server-only'
import { eventAuthers } from './authers'
import { eventSchemas } from './schemas'
import { eventFilterSelection } from './config'
import { notificationMethods } from '@/services/notifications/methods'
import { createCmsParagraph } from '@/services/cms/paragraphs/create'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import { createCmsImage } from '@/services/cms/images/create'
import { getOsloTime } from '@/lib/dates/getOsloTime'
import { ServerError } from '@/services/error'
import { serviceMethod } from '@/services/serviceMethod'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { displayDate } from '@/lib/dates/displayDate'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'
import type { EventExpanded } from './Types'

export const eventMethods = {
    create: serviceMethod({
        dataSchema: eventSchemas.create,
        authorizer: () => eventAuthers.create.dynamicFields({}),
        method: async ({ prisma, data, session }) => {
            const cmsParagraph = await createCmsParagraph({ name: uuid() })
            const cmsImage = await createCmsImage({ name: uuid() })

            if (data.eventStart > data.eventEnd) {
                throw new ServerError('BAD PARAMETERS', 'Event må jo strate før den slutter')
            }

            if (data.registrationStart && data.registrationEnd && data.registrationStart > data.registrationEnd) {
                throw new ServerError('BAD PARAMETERS', 'Påmelding må jo strate før den slutter')
            }

            if (data.registrationStart && !data.registrationEnd || !data.registrationStart && data.registrationEnd) {
                throw new ServerError('BAD PARAMETERS', 'Begge registreringsdatoer må være satt eller ingen')
            }

            const event = await prisma.event.create({
                data: {
                    name: data.name,
                    location: data.location,
                    eventStart: data.eventStart,
                    eventEnd: data.eventEnd,
                    takesRegistration: data.takesRegistration,
                    places: data.places,
                    registrationStart: data.registrationStart ?? getOsloTime(),
                    registrationEnd: data.registrationEnd ?? new Date(getOsloTime().getTime() + 1000 * 60 * 60 * 24),
                    canBeViewdBy: data.canBeViewdBy,
                    waitingList: data.waitingList,

                    createdBy: session?.user ? {
                        connect: {
                            id: session.user.id
                        }
                    } : undefined,

                    omegaOrder: {
                        connect: {
                            order: data.order || (await readCurrentOmegaOrder()).order
                        }
                    },
                    paragraph: {
                        connect: {
                            id: cmsParagraph.id
                        }
                    },
                    coverImage: {
                        connect: {
                            id: cmsImage.id
                        }
                    }
                }
            })
            await prisma.eventTagEvent.createMany({
                data: data.tagIds.map(tagId => ({
                    eventId: event.id,
                    tagId
                }))
            })

            await notificationMethods.createSpecial({
                params: {
                    special: 'NEW_EVENT',
                },
                data: {
                    title: `Hva der hender: ${event.name}`,
                    message: `${event.name}, 🕓 ${displayDate(event.eventStart, false)},📍 ${event.location}`,
                },
                bypassAuth: true,
            })
            return event
        }
    }),
    read: serviceMethod({
        paramsSchema: z.object({
            order: z.number(),
            name: z.string(),
        }),
        authorizer: () => eventAuthers.read.dynamicFields({}),
        method: async ({ prisma, params, session }) => {
            const event = await prisma.event.findUniqueOrThrow({
                where: {
                    order_name: {
                        order: params.order,
                        name: params.name
                    }
                },
                include: {
                    coverImage: {
                        include: {
                            image: true
                        }
                    },
                    paragraph: true,
                    eventTagEvents: {
                        include: {
                            tag: true
                        }
                    },
                    _count: {
                        select: {
                            eventRegistrations: true,
                        },
                    },
                    eventRegistrations: true,
                }
            })

            let onWaitingList = false

            if (!session.user) {
                event.eventRegistrations = []
            } else {
                const indexOfUser = event.eventRegistrations.findIndex(reg => reg.userId === session.user.id)
                if (indexOfUser !== -1) {
                    event.eventRegistrations = [event.eventRegistrations[indexOfUser]]
                    onWaitingList = indexOfUser >= event.places
                } else {
                    event.eventRegistrations = []
                }
            }

            if (onWaitingList && !event.waitingList) {
                onWaitingList = false
                event.eventRegistrations = []
            }

            return {
                ...event,
                numOfRegistrations: Math.min(event._count.eventRegistrations, event.places),
                numOnWaitingList: Math.max(0, event._count.eventRegistrations - event.places),
                onWaitingList,
                tags: event.eventTagEvents.map(ete => ete.tag)
            }
        }
    }),
    readManyCurrent: serviceMethod({
        paramsSchema: z.object({
            tags: z.array(z.string()).nullable(),
        }),
        authorizer: () => eventAuthers.readManyCurrent.dynamicFields({}),
        method: async ({ prisma, params }): Promise<EventExpanded[]> => {
            const events = await prisma.event.findMany({
                select: {
                    ...eventFilterSelection,
                    coverImage: {
                        include: {
                            image: true
                        }
                    },
                    eventTagEvents: {
                        include: {
                            tag: true
                        }
                    }
                },
                where: {
                    eventEnd: {
                        gte: getOsloTime()
                    },
                    eventTagEvents: eventTagSelector(params.tags)
                }
            })
            return events.map(event => ({
                ...event,
                numOfRegistrations: Math.min(event._count.eventRegistrations, event.places),
                numOnWaitingList: Math.max(0, event._count.eventRegistrations - event.places),
                tags: event.eventTagEvents.map(ete => ete.tag)
            }))
        }
    }),
    readManyArchivedPage: serviceMethod({
        paramsSchema: readPageInputSchemaObject(
            z.number(),
            z.object({
                id: z.number(),
            }),
            z.object({
                name: z.string().optional(),
                tags: z.array(z.string()).nullable(),
            }),
        ), // Converted from ReadPageInput<number, EventArchiveCursor, EventArchiveDetails>
        authorizer: () => eventAuthers.readManyArchivedPage.dynamicFields({}),
        method: async ({ prisma, params }): Promise<EventExpanded[]> => {
            const events = await prisma.event.findMany({
                ...cursorPageingSelection(params.paging.page),
                where: {
                    eventEnd: {
                        lt: getOsloTime()
                    },
                    name: {
                        contains: params.paging.details.name,
                        mode: 'insensitive'
                    },
                    eventTagEvents: eventTagSelector(params.paging.details.tags)
                },
                select: {
                    ...eventFilterSelection,
                    coverImage: {
                        include: {
                            image: true
                        }
                    },
                    eventTagEvents: {
                        include: {
                            tag: true
                        }
                    }
                },
            })
            return events.map(event => ({
                ...event,
                numOfRegistrations: Math.min(event._count.eventRegistrations, event.places),
                numOnWaitingList: Math.max(0, event._count.eventRegistrations - event.places),
                tags: event.eventTagEvents.map(ete => ete.tag)
            }))
        }
    }),
    update: serviceMethod({
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: eventSchemas.update,
        authorizer: () => eventAuthers.update.dynamicFields({}),
        method: async ({ prisma, params, data: { tagIds, ...data } }) => {
            const event = await prisma.event.findUniqueOrThrow({
                where: { id: params.id }
            })

            if ((data.eventStart ?? event?.eventStart) > (data.eventEnd ?? event?.eventEnd)) {
                throw new ServerError('BAD PARAMETERS', 'Event må jo strate før den slutter')
            }

            if (data.registrationStart && data.registrationEnd && data.registrationStart > data.registrationEnd) {
                throw new ServerError('BAD PARAMETERS', 'Påmelding må jo strate før den slutter')
            }

            if (data.registrationStart && !data.registrationEnd || !data.registrationStart && data.registrationEnd) {
                throw new ServerError('BAD PARAMETERS', 'Begge registreringsdatoer må være satt eller ingen')
            }

            const eventUpdate = await prisma.event.update({
                where: { id: params.id },
                data,
            })
            if (!tagIds) return eventUpdate

            await prisma.eventTagEvent.deleteMany({
                where: {
                    eventId: params.id,
                    NOT: {
                        tagId: {
                            in: tagIds
                        }
                    }
                }
            })

            await prisma.eventTagEvent.createMany({
                data: tagIds.map(tagId => ({
                    eventId: params.id,
                    tagId
                })),
                skipDuplicates: true
            })
            // TODO: Send email to users that get promoted from waiting list
            return eventUpdate
        }
    }),
    destroy: serviceMethod({
        paramsSchema: z.object({
            id: z.number()
        }),
        authorizer: () => eventAuthers.destroy.dynamicFields({}),
        method: async ({ prisma, params }) => {
            await prisma.event.delete({
                where: {
                    id: params.id
                }
            })
        }
    }),
}

function eventTagSelector(tags: string[] | null) {
    return tags ? {
        some: {
            tag: {
                name: {
                    in: tags
                }
            }
        }
    } : undefined
}
