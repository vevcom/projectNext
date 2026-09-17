import type { ExpandedGroup } from '@/services/groups/types'

export function findGroup(groups: ExpandedGroup[] | null, groupId: number): ExpandedGroup | undefined {
    return groups?.find(group => group.id === groupId)
}

/**
 * The orders a group has actually had active members in, as Select options - from
 * `group.firstOrder` up to and including `group.order`.
 */
export function orderOptions(group: ExpandedGroup | undefined) {
    if (!group) return []
    return Array.from(
        { length: group.order - group.firstOrder + 1 },
        (_, offset) => group.firstOrder + offset
    ).map(order => ({ value: order, label: order.toString(), key: order.toString() }))
}
