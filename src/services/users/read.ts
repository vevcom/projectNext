import { maxNumberOfGroupsInFilter, standardMembershipSelection, userFilterSelection } from './ConfigVars'
import { readUserAuther } from './authers'
import { readSpecialImage } from '@/services/images/read'
import { ServerError } from '@/services/error'
import { prismaCall } from '@/services/prismaCall'
import { getMembershipFilter } from '@/auth/getMembershipFilter'
import { readMembershipsOfUser } from '@/services/groups/memberships/read'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import prisma from '@/prisma'
import { readPermissionsOfUser } from '@/services/permissionRoles/read'
import { ServiceMethod } from '@/services/ServiceMethod'
import { z } from 'zod'
import type { UserDetails, UserCursor, UserPagingReturn } from './Types'
import type { ReadPageInput } from '@/lib/paging/Types'
import type { User } from '@prisma/client'

/**
 * A function to read a page of users with the given details (filtering)
 * @param readPageInput - This is a) the page to read and b) the details to filter by like
 * name and groups
 * @returns many users
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
        ...cursorPageingSelection(page),
        select: {
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
    studentCard?: string,
}

export async function readUser(where: readUserWhere): Promise<User> {
    return await prismaCall(() => prisma.user.findFirstOrThrow({ where }))
}

export async function readUserOrNull(where: readUserWhere): Promise<User | null> {
    return await prismaCall(() => prisma.user.findFirst({ where }))
}

export const readUserWithBalance = ServiceMethod({
    auther: ({ params }) => readUserAuther.dynamicFields({
        username: params.username || '',
    }),
    paramsSchema: z.object({
        username: z.string().optional(),
        id: z.number().optional(),
        email: z.string().optional(),
        studentCard: z.string().optional(),
    }),
    method: async ({ prisma: prisma_, params }) => {
        const user = await prisma_.user.findFirstOrThrow({
            where: params,
            include: {
                image: true,
            }
        })

        return {
            balance: 191900,
            user,
        }
    }
})

export const readUserProfile = ServiceMethod({
    paramsSchema: z.object({
        username: z.string(),
    }),
    auther: ({ params }) => readUserAuther.dynamicFields({ username: params.username }),
    method: async ({ prisma: prisma_, params }) => {
        const defaultProfileImage = await readSpecialImage.client(prisma).execute({
            params: { special: 'DEFAULT_PROFILE_IMAGE' },
            session: null, //TODO: pass session
        })
        const user = await prisma_.user.findUniqueOrThrow({
            where: { username: params.username.toLowerCase() },
            select: {
                ...userFilterSelection,
                bio: true,
                image: true,
            },
        }).then(async u => ({
            ...u,
            image: u.image || defaultProfileImage,
        }))

        const memberships = await readMembershipsOfUser(user.id)
        const permissions = await readPermissionsOfUser(user.id)

        return { user, memberships, permissions }
    }
})
