import 'server-only'
import { ActionReturn } from "@/actions/Types";
import { ExpandedInterestGroup } from "./Types";
import { readGroup, readGroups } from "@/server/groups/read";

export async function readInterestGroups(): Promise<ActionReturn<ExpandedInterestGroup[]>> {
    return readGroups('INTEREST_GROUP')
}

export async function readInterestGroup(id: number): Promise<ActionReturn<ExpandedInterestGroup>> {
    return readGroup(id, 'INTEREST_GROUP')
}