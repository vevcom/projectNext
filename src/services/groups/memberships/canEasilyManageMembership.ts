import { CanEasilyManageMembership } from './ConfigVars'
import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma-pn-client-instance'

export async function canEasilyManageMembershipOfGroup(groupId: number): Promise<boolean> {
    const group = await prismaCall(() => prisma.group.findUniqueOrThrow({
        where: {
            id: groupId
        }
    }))
    return CanEasilyManageMembership[group.groupType]
}

export async function canEasilyManageMembershipOfGroups(groupIds: number[]): Promise<boolean> {
    const groups = await prismaCall(() => prisma.group.findMany({
        where: {
            id: {
                in: groupIds
            }
        }
    }))
    return groups.every(group => CanEasilyManageMembership[group.groupType])
}
