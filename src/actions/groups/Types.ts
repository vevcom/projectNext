import type { groupEnumToKey } from './ConfigVars'
import type { Group, GroupType, Prisma } from '@prisma/client'

export type GroupEnumToKey = typeof groupEnumToKey

// Generic type for a specific group type which includes the information from
// both the generic group and specific group.
export type ExpandedGroup<T extends GroupType> = Group & (Prisma.GroupGetPayload<{
    select: { [K in GroupEnumToKey[T]]: true }
}> & {
    [K in GroupEnumToKey[T]]: Record<string, never>
})[GroupEnumToKey[T]]
