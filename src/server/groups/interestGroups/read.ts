import { prismaCall } from "@/server/prismaCall";
import { ExpandedInterestGroup } from "./Types";
import prisma from '@/prisma'

export async function readInterestGroups(): Promise<ExpandedInterestGroup[]> {
    return await prismaCall(() => prisma.interestGroup.findMany())
}

type ReadInterestGroupArgs = {
    id?: number,
    shortName?: string,
}

export async function readInterestGroup({ id, shortName }: ReadInterestGroupArgs): Promise<ExpandedInterestGroup> {
    return await prismaCall(() => prisma.interestGroup.findUniqueOrThrow({
        where: {
            id,
            shortName,
        }
    }))
}