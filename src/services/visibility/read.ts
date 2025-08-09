import '@pn-server-only'
import { SpecialVisibilityConfig } from './ConfigVars'
import { prismaCall } from '@/services/prismaCall'
import { ServerError } from '@/services/error'
import prisma from '@/prisma'
import type { SpecialVisibilityPurpose, VisibilityRequirmenetGroup } from '@prisma/client'
import type { VisibilityCollapsed } from './Types'

const levelSelector = {
    select: {
        permission: true,
        requirements: {
            select: {
                visibilityRequirmenetGroups: true
            }
        }
    }
}

/**
 * Reads visibility with levels, and with relation to groups, and returns the data
 * in a matrix format if type is REGULAR, or as permissions if type is SPECIAL i.e has
 * a special purpose.
 * @param id - the id of the visibility to read
 * @returns
 */
export async function readVisibilityCollapsed(id: number): Promise<VisibilityCollapsed> {
    const visibility = await prismaCall(() => prisma.visibility.findUnique({
        where: { id },
        include: {
            regularLevel: levelSelector,
            adminLevel: levelSelector,
        }
    }))
    if (!visibility) throw new ServerError('NOT FOUND', `Visibility ikke funnet for id ${id}`)
    if (visibility.specialPurpose) {
        return {
            type: 'SPECIAL',
            published: visibility.published,
            id: visibility.id,
            regular: visibility.regularLevel.permission,
            admin: visibility.adminLevel.permission,
            purpose: visibility.purpose
        }
    }
    return {
        type: 'REGULAR',
        published: visibility.published,
        purpose: visibility.purpose,
        id: visibility.id,
        regular: collapseVisibilityLevel(visibility.regularLevel),
        admin: collapseVisibilityLevel(visibility.adminLevel)
    }
}

/**
 * This function reads a special visibility, and creates it if it does not exist
 * (this should not happen in production)
 * @param specialPurpose - The purpose of the special visibility
 * @returns - The visibility
 */
export async function readSpecialVisibility(specialPurpose: SpecialVisibilityPurpose): Promise<VisibilityCollapsed> {
    const visibility = await prismaCall(() => prisma.visibility.findFirst({
        where: { specialPurpose },
        include: {
            regularLevel: levelSelector,
            adminLevel: levelSelector,
        }
    }))
    if (!visibility) {
        const created = await prismaCall(() => prisma.visibility.create({
            data: {
                purpose: 'SPECIAL',
                specialPurpose,
                published: true,
                regularLevel: {
                    create: {
                        permission: SpecialVisibilityConfig[specialPurpose].regularLevel
                    }
                },
                adminLevel: {
                    create: {
                        permission: SpecialVisibilityConfig[specialPurpose].adminLevel
                    }
                },
            },
            include: {
                regularLevel: levelSelector,
                adminLevel: levelSelector,
            }
        }))
        return {
            type: 'SPECIAL',
            published: created.published,
            id: created.id,
            regular: created.regularLevel.permission,
            admin: created.adminLevel.permission,
            purpose: created.purpose
        }
    }
    return {
        type: 'SPECIAL',
        published: visibility.published,
        id: visibility.id,
        regular: visibility.regularLevel.permission,
        admin: visibility.adminLevel.permission,
        purpose: visibility.purpose
    }
}

/**
 * A higher order function that includes visibility in the result of a server call
 * @param serverCall - A function to get some data, with a relation to visibility
 * @param getVisibilityId - A methode to retrive the visibility id from the result of the server call
 * @returns - The data from the server call, with the visibility included
 */
export async function includeVisibility<T>(serverCall: () => Promise<T>, getVisibilityId: (result: T) => number) {
    const result = await serverCall()
    const visibility = await readVisibilityCollapsed(getVisibilityId(result))
    return { ...result, visibility }
}

function collapseVisibilityLevel(level: {requirements: {visibilityRequirmenetGroups: VisibilityRequirmenetGroup[]}[]}) {
    return level.requirements.map(requirement =>
        requirement.visibilityRequirmenetGroups.map(groupItem => groupItem.groupId)
    )
}
