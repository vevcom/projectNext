import { prismaCall } from "@/server/prismaCall";
import { ExpandedOmegaMembershipGroup } from "./Types";

export async function readOmegaMembershipGroups(): Promise<ExpandedOmegaMembershipGroup[]> {
    return await prismaCall(() => prisma.omegaMembershipGroup.findMany())
}

export async function readOmegaMembershipGroup(id: number): Promise<ExpandedOmegaMembershipGroup> {
    return await prismaCall(() => prisma.omegaMembershipGroup.findUniqueOrThrow({
        where: {
            id,
        },
    }))
}
