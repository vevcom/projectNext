import type { Prisma } from '@prisma/client'

export type RoleWithPermissions = Prisma.RoleGetPayload<{include: { permissions: { select: { permission: true } } } }>
