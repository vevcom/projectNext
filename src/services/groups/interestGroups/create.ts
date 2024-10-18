import 'server-only'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { createInterestGroupValidation } from './validation'

export const create = ServiceMethodHandler({
    withData: true,
    validation: createInterestGroupValidation,
    handler: async (prisma, _, data) => {
        const { order } = await readCurrentOmegaOrder()
    
        await prisma.interestGroup.create({
            data: {
                ...data,
                articleSection: {
                    create: {
                        cmsImage: {},
                        cmsParagraph: {},
                        cmsLink: {},
                    }
                },
                group: {
                    create: {
                        groupType: 'INTEREST_GROUP',
                        order,
                    }
                }
            }
        })        
    }
})
 