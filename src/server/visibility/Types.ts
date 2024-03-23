import type { Permission } from "@prisma/client"

export type MembershipMatrix = number[][]

/**
 * A type that represents a visibility in a simple way. 
 * Either type is SPECIAL and and levels are based on Permissions,
 * or type is REGULAR and the levels are represented by matrix of memberships to groups
 */
export type VisibilityCollapsed = {
    type: 'REGULAR'
    regular: MembershipMatrix,
    admin: MembershipMatrix
} | {
    type: 'SPECIAL'
    regular: Permission | null,
    admin: Permission | null
}