import 'server-only'
import { EventSchemas } from './schemas'
import { EventConfig } from './config'
import { EventAuthers } from './authers'
import { createCmsParagraph } from '@/services/cms/paragraphs/create'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import { createCmsImage } from '@/services/cms/images/create'
import { getOsloTime } from '@/lib/dates/getOsloTime'
import { ServerError } from '@/services/error'
import { ServiceMethod } from '@/services/ServiceMethod'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'

export namespace EventMethods {
    export const create = ServiceMethod({
        dataSchema: EventSchemas.create,
        auther: () => EventAuthers.create.dynamicFields({}),
        method: async ({ prisma, data }) => {
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
                    eventStart: data.eventStart,
                    eventEnd: data.eventEnd,
                    takesRegistration: data.takesRegistration,
                    places: data.places,
                    registrationStart: data.registrationStart ?? getOsloTime(),
                    registrationEnd: data.registrationEnd ?? new Date(getOsloTime().getTime() + 1000 * 60 * 60 * 24),
                    canBeViewdBy: data.canBeViewdBy,

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
            return event
        }
    })
    export const read =ServiceMethod({
        paramsSchema: z.object({
            order: z.number(),
            name: z.string(),
        }),
        auther: () => EventAuthers.read.dynamicFields({}),
        method: async ({ prisma, params }) => {
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
                    }
                }
            })
            return {
                ...event,
                tags: event.eventTagEvents.map(ete => ete.tag)
            }
        }
    })
    export const readManyCurrent = ServiceMethod({
        paramsSchema: z.object({
            tags: z.array(z.string()).nullable(),
        }),
        auther: () => EventAuthers.readManyCurrent.dynamicFields({}),
        method: async ({ prisma, params }) => {
            const events = await prisma.event.findMany({
                select: {
                    ...EventConfig.filterSeletion,
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
                tags: event.eventTagEvents.map(ete => ete.tag)
            }))
        }
    })
    export const readManyArchivedPage = ServiceMethod({
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
        auther: () => EventAuthers.readManyArchivedPage.dynamicFields({}),
        method: async ({ prisma, params }) => {
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
                    ...EventConfig.filterSeletion,
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
                tags: event.eventTagEvents.map(ete => ete.tag)
            }))
        }
    })
    export const update = ServiceMethod({
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: EventSchemas.update,
        auther: () => EventAuthers.update.dynamicFields({}),
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
            return eventUpdate
        }
    })
    export const destroy = ServiceMethod({
        paramsSchema: z.object({
            id: z.number()
        }),
        auther: () => EventAuthers.destroy.dynamicFields({}),
        method: async ({ prisma, params }) => {
            await prisma.event.delete({
                where: {
                    id: params.id
                }
            })
        }
    })

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
}