import type { ExpandedGroup, GroupsStructured } from "@/server/groups/Types"

export type VisibilityRequiermentForAdmin = {
    name: string
    groups: (ExpandedGroup & {
        selected: boolean
    })[]
}

export type VisibilityStructuredForAdmin = {
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
