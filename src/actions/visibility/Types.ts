import type { ExpandedGroup, GroupsStructured } from '@/services/groups/Types'

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
