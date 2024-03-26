'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError } from '@/actions/error'
import { readGroupsStructured } from '@/server/groups/read'
import { readVisibilityCollapsed } from '@/server/visibility/read'
import { checkVisibility } from '@/auth/checkVisibility'
import { getUser } from '@/auth/getUser'
import { PurposeTextsConfig } from '@/server/visibility/ConfigVars'
import { GroupTypesConfig } from '@/server/groups/ConfigVars'
import type { ExpandedGroup, GroupsStructured } from '@/server/groups/Types'
import type { GroupMatrix } from '@/server/visibility/Types'
import type { ActionReturn } from '@/actions/Types'
import type { GroupType } from '@prisma/client'
import type { VisibilityRequiermentForAdmin, VisibilityStructuredForAdmin } from './Types'

export async function readVisibilityForAdminAction(id: number): Promise<ActionReturn<VisibilityStructuredForAdmin>> {
    const [visibilityRes, groupsRes] = await Promise.all([
        safeServerCall(() => readVisibilityCollapsed(id)),
        safeServerCall(() => readGroupsStructured())
    ])
    if (!visibilityRes.success || !groupsRes.success) return createActionError('UNKNOWN ERROR', 'noe gikk galt')

    const visibility = visibilityRes.data
    const groups = groupsRes.data
    const purpose = PurposeTextsConfig[visibility.purpose]

    if (!checkVisibility(await getUser(), visibility, 'ADMIN')) {
        return createActionError('UNAUTHORIZED', 'You do not have permission to admin this collection')
    }
    if (visibility.type === 'SPECIAL') {
        return {
            success: true,
            data: {
                purpose,
                type: 'SPECIAL',
                message: 'Denne syneligheten er spessiell',
                regular: `Brukere med ${visibility.regular} har vanlig tilgang`,
                admin: `Brukere med ${visibility.admin} har admin tilgang`,
            }
        }
    }
    return {
        success: true,
        data: {
            purpose,
            type: 'REGULAR',
            regular: expandOneLevel(visibility.regular, groups),
            admin: expandOneLevel(visibility.admin, groups),
            groups,
        }
    }
}

const standardGroupings = ['CLASS', 'OMEGA_MEMBERSHIP_GROUP', 'STUDY_PROGRAMME'] satisfies GroupType[]

function expandOneLevel(matrix: GroupMatrix, groups: GroupsStructured): VisibilityRequiermentForAdmin[] {
    const res: VisibilityRequiermentForAdmin[] = []
    standardGroupings.forEach(groupType => {
        if (!groups[groupType]) return
        const standardRequriment: VisibilityRequiermentForAdmin = {
            name: GroupTypesConfig[groupType].name,
            groups: groups[groupType].groups.map(group => ({
                ...group,
                selected: false
            }))
        }
        //Find out if there is a row in the matrix with just the group type.
        for (let i = 0; i < matrix.length; i++) {
            if (matrix[i].every(groupId => groupTypeOfId(groupId, groups) === groupType)) {
                standardRequriment.groups.forEach(group => {
                    group.selected = matrix[i].includes(group.id)
                })
                //Remove the row from the matrix since it has been handled
                matrix.splice(i, 1)
            }
        }
        res.push(standardRequriment)
    })

    //Handle all non standard groupings
    matrix.forEach(row => {
        const groups_ = row.reduce((acc, id) => {
            const g = findGroupOfId(id, groups)
            if (g) acc.push(g)
            return acc
        }, [] as ExpandedGroup[])
        const nonStandardRequriment: VisibilityRequiermentForAdmin = {
            name: 'ekstra',
            groups: groups_.map(g => ({
                ...g,
                selected: true
            }))
        }
        res.push(nonStandardRequriment)
    })

    return res
}

function findGroupOfId(id: number, groups: GroupsStructured): ExpandedGroup | null {
    let found: ExpandedGroup | null = null
    Object.values(groups).forEach(groupType => {
        groupType.groups.forEach(group => {
            if (group.id === id) {
                found = group
            }
        })
    })
    return found
}

function groupTypeOfId(id: number, groups: GroupsStructured): GroupType {
    let type: GroupType | null = null
    Object.values(groups).forEach((groupType) => {
        groupType.groups.forEach(group => {
            if (group.id === id) {
                type = group.groupType
            }
        })
    })
    return type || 'MANUAL_GROUP'
}
