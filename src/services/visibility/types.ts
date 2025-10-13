import type { ExpandedGroup, GroupsStructured } from '@/services/groups/types'
import type { Matrix } from '@/lib/checkMatrix'
import type { Permission, VisibilityPurpose } from '@prisma/client'

export type GroupMatrix = Matrix<number>

export type VisibilityLevelType = 'ADMIN' | 'REGULAR'

export type VisibilityLevelMatrices = {
    regular: GroupMatrix,
    admin: GroupMatrix
}

/**
 * A type that represents a visibility in a simple way.
 * Either type is SPECIAL and and levels are based on Permissions,
 * or type is REGULAR and the levels are represented by matrix of ids of groups
 */
export type VisibilityCollapsed = {
    id: number,
    purpose: VisibilityPurpose
    published: boolean,
} & ({
    type: 'REGULAR',
    regular: GroupMatrix,
    admin: GroupMatrix
} | {
    type: 'SPECIAL'
    regular: Permission | null,
    admin: Permission | null
})

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
