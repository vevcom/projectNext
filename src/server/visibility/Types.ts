import type { Matrix } from '@/utils/checkMatrix'
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
