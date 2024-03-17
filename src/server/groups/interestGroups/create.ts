import { prismaCall } from "@/server/prismaCall";
import { ExpandedInterestGroup } from "./Types";
import prisma from "@/prisma";

type CreateInterestGroupArgs = {
    name: string,
    shortName: string,
}

export async function createInterestGroup({ name, shortName }: CreateInterestGroupArgs): Promise<ExpandedInterestGroup> {
    return await prismaCall(() => prisma.interestGroup.create({
        data: {
            name,
            shortName,
            group: {
                create: {
                    groupType: 'INTEREST_GROUP',
                    membershipRenewal: false,
                }
            }
        }
    }))
}