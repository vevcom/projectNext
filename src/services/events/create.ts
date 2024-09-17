import 'server-only'
import { ServiceMethodHandler } from '../ServiceMethodHandler'
import { createEventValidation } from './validation'
import { createCmsParagraph } from '@/services/cms/paragraphs/create'
import { v4 as uuid } from 'uuid'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import { createCmsImage } from '@/services/cms/images/create'

export const create = ServiceMethodHandler({
    withData: true,
    validation: createEventValidation,
    handler: async (prisma, _, data) => {
        const cmsParagraph = await createCmsParagraph({ name: uuid() })
        const cmsImage = await createCmsImage({ name: uuid() })

        return await prisma.event.create({
            data: {
                name: data.name,
                eventStart: data.eventStart,
                eventEnd: data.eventEnd,
                takesRegistration: data.takesRegistration,
                places: data.places,
                registrationStart: data.registrationStart ?? new Date(),
                registrationEnd: data.registrationEnd ?? new Date(),
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