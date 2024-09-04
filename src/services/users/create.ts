import 'server-only'
import { ServiceMethod } from '@/services/ServiceMethod'
import { readOmegaMembershipGroup } from '@/services/groups/omegaMembershipGroups/read'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import { createUserValidation } from '@/services/users/validation'

export const CreateUser = ServiceMethod({
    data: true,
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
