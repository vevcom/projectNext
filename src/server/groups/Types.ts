import type { groupEnumToKey } from './ConfigVars'
import { Group, GroupType, Prisma } from '@prisma/client'

export type GroupEnumToKey = typeof groupEnumToKey

// Input types for CRUD operations

export type GroupCreateInput<T extends GroupType> = (
    Omit<Group, 'groupType' | 'id'>
) & {
    details: Required<Prisma.GroupCreateInput>[GroupEnumToKey[T]]['create'],
}

export type SpecificGroupCreateInput<T extends GroupType> = Pick<GroupCreateInput<T>, 'name' | 'details'>

export type GroupUpdateInput<T extends GroupType> = Partial<Omit<GroupCreateInput<T>, 'id'>>

export type SpecificGroupUpdateInput<T extends GroupType> = Pick<GroupUpdateInput<T>, 'name' | 'details'>

// Return types

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
