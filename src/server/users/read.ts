import { maxNumberOfGroupsInFilter, standardMembershipSelection, userFilterSelection } from './ConfigVars'
import { ServerError } from '@/server/error'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import { getMembershipFilter } from '@/auth/getMembershipFilter'
import type { Prisma } from '@prisma/client'
import type { UserDetails, UserPagingReturn } from './Types'
import type { ReadPageInput } from '@/actions/Types'

/**
 * A function to read a page of users with the given details (filtering)
 * @param readPageInput - This is a) the page to read and b) the details to filter by like
 * name and groups
 * @returns
 */
export async function readUserPage<const PageSize extends number>({
    page,
    details
}: ReadPageInput<PageSize, UserDetails>): Promise<UserPagingReturn[]> {
    const words = details.partOfName.split(' ')

    if (details.groups.length > maxNumberOfGroupsInFilter) {
        throw new ServerError('BAD PARAMETERS', 'Too many groups in filter')
    }
    const extraInforAboutMembershipSelection = details.selectedGroup ? [
        getMembershipFilter(details.selectedGroup.groupOrder, details.selectedGroup.groupId)
    ] : []
    const membershipWhereSelection: Prisma.MembershipWhereInput[] = [
        ...standardMembershipSelection,
        ...extraInforAboutMembershipSelection
    ]

    const groups = details.groups
    if (details.selectedGroup) groups.concat(details.selectedGroup)

    const users = await prismaCall(() => prisma.user.findMany({
        skip: page.page * page.pageSize,
        take: page.pageSize,
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
                    AND: [
                        {
                            OR: membershipWhereSelection,
                        },
                        getMembershipFilter('ACTIVE')
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
            extraInfoOnMembership: {
                title,
                admin
            }
        }
    })
}
