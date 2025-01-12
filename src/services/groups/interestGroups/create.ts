import 'server-only'
import { createInterestGroupValidation } from './validation'
import { createInterestGroupAuther } from './Auther'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import { ServiceMethod } from '@/services/ServiceMethod'

export const createInterestGroup = ServiceMethod({
    dataValidation: createInterestGroupValidation,
    auther: createInterestGroupAuther,
    dynamicAuthFields: () => ({}),
    method: async ({ prisma, data }) => {
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
