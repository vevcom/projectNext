'use server'
import { safeServerCall } from '../safeServerCall'
import { destroyUser } from '@/server/users/destroy'
import type { ActionReturn } from '@/actions/Types'
import type { User } from '@prisma/client'

/**
 * Action to destroy a user by the given id
 * @param id - The id of the user to destroy
 * @returns
 */
export async function destroyUserAction(id: number): Promise<ActionReturn<User>> {
    return await safeServerCall(() => destroyUser(id))
}

