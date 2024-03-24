import 'server-only'
import { VisibilityCollapsed } from './Types';
import { prismaCall } from '../prismaCall';
import { ServerError } from '../error';
import { VisibilityRequirmenetGroup } from '@prisma/client';

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
 * in a matrix format if type is REGULAR, or as permissions if type is SPECIAL
 * @param id - the id of the visibility to read
 * @returns 
 */
export async function readVisibilityCollapsed(id: number) : Promise<VisibilityCollapsed> {
    const visibility = await prismaCall(() => prisma.visibility.findUnique({
        where: { id },
        include: {
            regularLevel: levelSelector,
            adminLevel: levelSelector,
        }
    }))
    if (!visibility) throw new ServerError('NOT FOUND', `Visibility ikke funnet for id ${id}`)
    if (visibility.type === 'SPECIAL') {
        return {
            type: 'SPECIAL',
            regular: visibility.regularLevel.permission,
            admin: visibility.adminLevel.permission
        }
    } 
    return {
        type: 'REGULAR',
        regular: collapseVisibilityLevel(visibility.regularLevel),
        admin: collapseVisibilityLevel(visibility.adminLevel)
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

function collapseVisibilityLevel(level: {requirements: {visibilityRequirmenetGroups: VisibilityRequirmenetGroup[]}[]}){
    return level.requirements.map(r => r.visibilityRequirmenetGroups.map(g => g.groupId))
}