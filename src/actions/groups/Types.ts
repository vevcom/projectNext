import type { groupEnumToKey } from './ConfigVars'
import type { Group, GroupType, Prisma } from '@prisma/client'

export type GroupEnumToKey = typeof groupEnumToKey

export type GroupCreateInput<T extends GroupType> = (
    Omit<Group, 'groupType' | 'id'>
) & {
    details: Required<Prisma.GroupCreateInput>[GroupEnumToKey[T]]['create'],
}

export type GroupUpdateInput<T extends GroupType> = Partial<Omit<GroupCreateInput<T>, 'id'>>

export type SpecificGroup<T extends GroupType> = (
    Prisma.GroupGetPayload<{
        select: { [K in GroupEnumToKey[T]]: true }
    }> & {
        [K in GroupEnumToKey[T]]: {}
    }
)[GroupEnumToKey[T]]

// Generic type for a specific group type which includes the information from
// both the generic group and specific group.
export type ExpandedGroup<T extends (GroupType | undefined) = undefined> = (
    Group & (undefined extends T 
        ? {} 
        : SpecificGroup<NonNullable<T>>
    )
)