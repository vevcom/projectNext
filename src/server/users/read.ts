import { maxNumberOfGroupsInFilter, standardMembershipSelection, userFilterSelection } from './ConfigVars'
import { ServerError } from '@/server/error'
import { prismaCall } from '@/server/prismaCall'
import { getMembershipFilter } from '@/auth/getMembershipFilter'
import { readPermissionsOfUser } from '@/server/permissionRoles/read'
import { readMembershipsOfUser } from '@/server/groups/memberships/read'
import { cursorPageingSelection } from '@/server/paging/cursorPageingSelection'
import prisma from '@/prisma'
import type { UserFiltered, UserDetails, UserCursor, Profile, UserPagingReturn } from './Types'
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
}: ReadPageInput<PageSize, UserCursor, UserDetails>): Promise<UserPagingReturn[]> {
    const words = details.partOfName.split(' ')

    if (details.groups.length > maxNumberOfGroupsInFilter) {
        throw new ServerError('BAD PARAMETERS', 'Too many groups in filter')
    }
    const groupSelection = details.selectedGroup ? [
        getMembershipFilter(details.selectedGroup.groupOrder, details.selectedGroup.groupId)
    ] : []

    const groups = [...details.groups, ...(details.selectedGroup ? [details.selectedGroup] : [])]

    const users = await prismaCall(() => prisma.user.findMany({
        
        select: {
            ...cursorPageingSelection(page),
            ...userFilterSelection,
            memberships: {
                select: {
                    admin: true,
                    title: true,
                    groupId: true,
                    group: {
                        select: {
                            class: { select: { year: true } },
                            studyProgramme: { select: { code: true } },
                            omegaMembershipGroup: { select: { omegaMembershipLevel: true } }
                        }
                    }
                },
                where: {
                    OR: [
                        {
                            AND: [
                                {
                                    OR: standardMembershipSelection,
                                },
                                getMembershipFilter('ACTIVE')
                            ]
                        },
                        {
                            OR: groupSelection
                        }
                    ]

                }
            },
        },
        where: {
            AND: [
                ...words.map((word, i) => {
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
                }),
                ...groups.map(group => ({
                    memberships: {
                        some: {
                            ...getMembershipFilter(group.groupOrder, group.groupId),
                        }
                    }
                }))
            ],
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
    return users.map(user => {
        const clas = user.memberships.find(
            m => m.group.class !== null)?.group.class?.year
        const studyProgramme = user.memberships.find(
            m => m.group.studyProgramme !== null)?.group.studyProgramme?.code
        const membershipType = user.memberships.find(
            m => m.group.omegaMembershipGroup !== null)?.group.omegaMembershipGroup?.omegaMembershipLevel
        const title = user.memberships.find(
            m => m.groupId === details.selectedGroup?.groupId)?.title
        const admin = user.memberships.find(
            m => m.groupId === details.selectedGroup?.groupId)?.admin
        return {
            ...user,
            class: clas,
            studyProgramme,
            membershipType,
            selectedGroupInfo: {
                title,
                admin
            }
        }
    })
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
