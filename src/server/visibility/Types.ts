import type { Permission, VisibilityType } from "@prisma/client"
import { BasicMembership } from "../groups/Types"

/**
 * Type that represents visibility in a simple form
 */
export type VisibilityLevelCollapsed = {
    type: 'SPECIAL',
    permission: Permission | null
} | {
    type: 'REGULAR'
    groupMatrix: BasicMembership[][]
}

export type VisibilityCollapsed = {
    regular: VisibilityLevelCollapsed,
    admin: VisibilityLevelCollapsed
}