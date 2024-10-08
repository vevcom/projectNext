import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { readOmegaMembershipGroup } from '@/services/groups/omegaMembershipGroups/read'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import { createUserValidation } from '@/services/users/validation'

export const create = ServiceMethodHandler({
    withData: true,
    validation: createUserValidation,
    handler: async (prisma, _, data) => {
        const omegaMembership = await readOmegaMembershipGroup('EXTERNAL')
        const omegaOrder = await readCurrentOmegaOrder()

        return await prisma.user.create({
            data: {
                ...data,
                memberships: {
                    create: [{
                        groupId: omegaMembership.groupId,
                        order: omegaOrder.order,
                        admin: false,
                        active: true,
                    }]
                }
            },
        })
    }
})
