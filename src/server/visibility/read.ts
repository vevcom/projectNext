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

function collapseVisibilityLevel(level: {requirements: {visibilityRequirmenetGroups: VisibilityRequirmenetGroup[]}[]}){
    return level.requirements.map(r => r.visibilityRequirmenetGroups.map(g => g.groupId))

}