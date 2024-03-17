import { prismaCall } from "@/server/prismaCall";
import { ExpandedInterestGroup } from "./Types";
import prisma from '@/prisma'

type CreateInterestGroupArgs = {
    name: string,
    shortName: string,
}

export async function updateInterestGroup(id: number, data: CreateInterestGroupArgs): Promise<ExpandedInterestGroup> {
    return await prismaCall(() => prisma.interestGroup.update({
        where: {
            id,
        },
        data,
    }))
}