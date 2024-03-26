import type { Permission, VisibilityPurpose } from '@prisma/client'

export type GroupMatrix = number[][]


export type VisibilityCollapsedWithouPurpose = {
    type: 'REGULAR',
    published: boolean,
    regular: GroupMatrix,
    admin: GroupMatrix
} | {
    type: 'SPECIAL'
    published: boolean,
    regular: Permission | null,
    admin: Permission | null
}

/**
 * A type that represents a visibility in a simple way.
 * Either type is SPECIAL and and levels are based on Permissions,
 * or type is REGULAR and the levels are represented by matrix of ids of groups
 */
export type VisibilityCollapsed = VisibilityCollapsedWithouPurpose & {
    id: number,
    purpose: VisibilityPurpose
}
