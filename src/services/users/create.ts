import 'server-only'
import { readOmegaMembershipGroup } from '@/services/groups/omegaMembershipGroups/read'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'
import { createUserValidation } from '@/services/users/validation'
import type { User } from '@prisma/client'
import type { CreateUserTypes } from '@/services/users/validation'

/**
 * A action that creates a user by the given data. It will also hash the password
 * @param data - The user to create
 * @returns - The created user
 */
export async function createUser(rawdata: CreateUserTypes['Detailed']): Promise<User> {
    const data = createUserValidation.detailedValidate(rawdata)

    const omegaMembership = await readOmegaMembershipGroup('EXTERNAL')
    const omegaOrder = await readCurrentOmegaOrder()

    return await prismaCall(() => prisma.user.create({
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
    }))
}
