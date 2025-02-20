import 'server-only'
import { createUserAuther } from './authers'
import { sendUserInvitationEmail } from '@/services/notifications/email/systemMail/userInvitivation'
import { readOmegaMembershipGroup } from '@/services/groups/omegaMembershipGroups/read'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import { createUserValidation } from '@/services/users/validation'
import { ServiceMethod } from '@/services/ServiceMethod'

export const createUser = ServiceMethod({
    dataValidation: createUserValidation,
    auther: () => createUserAuther.dynamicFields({}),
    method: async ({ prisma, data }) => {
        const omegaMembership = await readOmegaMembershipGroup('EXTERNAL')
        const omegaOrder = await readCurrentOmegaOrder()

        const user = await prisma.user.create({
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

        setTimeout(() => sendUserInvitationEmail(user), 1000)

        return user
    }
})
