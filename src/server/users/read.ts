import { userFilterSelection } from './ConfigVars'
import { readPermissionsOfUser } from '@/server/permissionRoles/read'
import { readMembershipsOfUser } from '@/server/groups/read'
import { cursorPageingSelection } from '@/server/paging/cursorPageingSelection'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { UserFiltered, UserDetails, UserCursor, Profile } from './Types'
import type { ReadPageInput } from '@/server/paging/Types'
import type { User } from '@prisma/client'

/**
 * A function to read a page of users with the given details (filtering)
 * @param readPageInput - This is a) the page to read and b) the details to filter by like
 * name and groups
 * @returns
 */
export async function readUserPage<const PageSize extends number>({
    page,
    details
}: ReadPageInput<PageSize, UserCursor, UserDetails>): Promise<UserFiltered[]> {
    const words = details.partOfName.split(' ')
    return await prismaCall(() => prisma.user.findMany({
        ...cursorPageingSelection(page),
        select: userFilterSelection,
        where: {
            AND: words.map((word, i) => {
                const condition = {
                    [i === words.length - 1 ? 'contains' : 'equals']: word,
                    mode: 'insensitive'
                } as const
                return {
                    OR: [
                        { firstname: condition },
                        { lastname: condition },
                        { username: condition },
                    ],
                }
            })
            //TODO select on groups
        },
        orderBy: [
            { lastname: 'asc' },
            { firstname: 'asc' },
            // We have to sort with at least one unique field to have a
            // consistent order. Sorting rows by fieds that have the same
            // value is undefined behaviour in postgresql.
            { username: 'asc' },
        ]
    }))
}

type readUserWhere = {
    username?: string,
    id?: number,
    email?: string,
}

export async function readUser(where: readUserWhere): Promise<User> {
    return await prismaCall(() => prisma.user.findFirstOrThrow({ where }))
}

export async function readUserOrNull(where: readUserWhere): Promise<User | null> {
    return await prismaCall(() => prisma.user.findFirst({ where }))
}

export async function readUserProfile(username: string): Promise<Profile> {
    const user = await prismaCall(() => prisma.user.findUniqueOrThrow({
        where: { username },
        select: {
            ...userFilterSelection,
            bio: true,
            image: true,
        },
    }))

    const permissions = await readPermissionsOfUser(user.id)
    const memberships = await readMembershipsOfUser(user.id)

    return { user, permissions, memberships }
}
