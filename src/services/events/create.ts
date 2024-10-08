import 'server-only'
import { createEventValidation } from './validation'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { createCmsParagraph } from '@/services/cms/paragraphs/create'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import { createCmsImage } from '@/services/cms/images/create'
import { getOsloTime } from '@/dates/getOsloTime'
import { ServerError } from '@/services/error'
import { v4 as uuid } from 'uuid'

export const create = ServiceMethodHandler({
    withData: true,
    validation: createEventValidation,
    handler: async (prisma, _, data) => {
        console.log('create event')
        console.log('data', data)
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

        return await prisma.event.create({
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
    }
})
