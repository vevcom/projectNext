import { Prisma } from "@prisma/client";

export const expandedRoleIncluder = Prisma.validator<Prisma.RoleInclude>()({
    permissions: {
        select: {
            permission: true,
        },
    },
    groups: {
        select: {
            groupId: true,
            forAdminsOnly: true,
        },
    },
})