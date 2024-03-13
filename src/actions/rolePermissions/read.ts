'use server'
import { createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import type { Permission, Prisma, User } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import type { RoleWithPermissions } from '@/server/rolePermissions/Types'
import { readRoles, readUsersOfRole } from '@/server/rolePermissions/read'

export async function readRolesAction(): Promise<ActionReturn<RoleWithPermissions[]>> {
    //TODO: Auth
    return await readRoles()
}

export async function readUsersOfRoleAction(roleId: number): Promise<ActionReturn<User[]>> {
    //TODO: Auth
    return await readUsersOfRole(roleId)
}
