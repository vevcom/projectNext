import type { Permission } from "@prisma/client"

export type GroupMatrix = number[][]

/**
 * A type that represents a visibility in a simple way. 
 * Either type is SPECIAL and and levels are based on Permissions,
 * or type is REGULAR and the levels are represented by matrix of ids of groups
 */
export type VisibilityCollapsed = {
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