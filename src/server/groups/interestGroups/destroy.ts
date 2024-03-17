import { prismaCall } from "@/server/prismaCall";
import { ExpandedInterestGroup } from "./Types";

export async function destroyInterestGroup(id: number): Promise<ExpandedInterestGroup> {
    return await prismaCall(() => prisma.interestGroup.delete({
        where: {
            id,
        },
    }))
}