'use server'

import { createActionError } from '@/services/actionError'
import { safeServerCall } from '@/services/actionError'
import { checkVisibility } from '@/auth/checkVisibility'
import { getUser } from '@/auth/getUser'
import { GroupTypesConfig } from '@/services/groups/config'
import { GroupMethods } from '@/services/groups/methods'
import { PurposeTextsConfig } from '@/services/visibility/ConfigVars'
import { readVisibilityCollapsed } from '@/services/visibility/read'
import type { ExpandedGroup, GroupsStructured } from '@/services/groups/Types'
import type { ActionReturn } from '@/services/actionTypes'
import type { GroupMatrix, VisibilityLevelType } from '@/services/visibility/Types'
import type { GroupType } from '@prisma/client'

export type VisibilityRequiermentForAdmin = {
    name: string
    groups: (ExpandedGroup & {
        selected: boolean
    })[]
}

export type VisibilityStructuredForAdmin = {
    published: boolean
    purpose: string
} & (
    {
        type: 'REGULAR'
        groups: GroupsStructured
        regular: VisibilityRequiermentForAdmin[]
        admin: VisibilityRequiermentForAdmin[]
    } | {
        type: 'SPECIAL'
        message: string
        regular: string
        admin: string
    }
)

export async function readVisibilityForAdminAction(id: number): Promise<ActionReturn<VisibilityStructuredForAdmin>> {
    const [visibilityRes, groupsRes] = await Promise.all([
        safeServerCall(() => readVisibilityCollapsed(id)),
        // TODO: Fix Authing here. The bypass should be false
        safeServerCall(() => GroupMethods.readGroupsStructured({ session: null, bypassAuth: true }))
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
                published: visibility.published,
                purpose,
                type: 'SPECIAL',
                message: 'Denne syneligheten er spessiell',
                regular: `Brukere med ${visibility.regular} har vanlig tilgang`,
                admin: `Brukere med ${visibility.admin} har admin tilgang`,
            }
        }
    }
    const standardGroupingsRefular = ['CLASS', 'OMEGA_MEMBERSHIP_GROUP', 'STUDY_PROGRAMME'] satisfies GroupType[]
    const standardGroupingsAdmin = ['COMMITTEE', 'OMEGA_MEMBERSHIP_GROUP'] satisfies GroupType[]
    return {
        success: true,
        data: {
            published: visibility.published,
            purpose,
            type: 'REGULAR',
            regular: expandOneLevel(visibility.regular, groups, standardGroupingsRefular),
            admin: expandOneLevel(visibility.admin, groups, standardGroupingsAdmin),
            groups,
        }
    }
}

function expandOneLevel(
    matrix: GroupMatrix,
    groups: GroupsStructured,
    standardGroupings: GroupType[]
): VisibilityRequiermentForAdmin[] {
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
            const group = findGroupOfId(id, groups)
            if (group) acc.push(group)
            return acc
        }, [] as ExpandedGroup[])
        const nonStandardRequriment: VisibilityRequiermentForAdmin = {
            name: 'ekstra',
            groups: groups_.map(group => ({
                ...group,
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

export async function updateVisibilityAction(
    level: VisibilityLevelType,
    formdata: FormData
): Promise<ActionReturn<void>> {
    console.log(formdata)
    return { success: true, data: undefined }
}
