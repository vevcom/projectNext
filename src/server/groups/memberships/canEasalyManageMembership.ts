import { CanEasalyManageMembership } from "./ConfigVars"
import { prismaCall } from "@/server/prismaCall"

export async function canEasalyManageMembershipOfGroup(groupId: number): Promise<boolean> {
    const group = await prismaCall(() => prisma.group.findUniqueOrThrow({
        where: {
            id: groupId
        }
    }))
    return CanEasalyManageMembership[group.groupType]
}

export async function canEasalyManageMembershipOfGroups(groupIds: number[]): Promise<boolean> {
    const groups = await prismaCall(() => prisma.group.findMany({
        where: {
            id: {
                in: groupIds
            }
        }
    }))
    return groups.every(group => CanEasalyManageMembership[group.groupType])
}