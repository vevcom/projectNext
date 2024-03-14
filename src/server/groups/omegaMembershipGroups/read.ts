import 'server-only'
import { ActionReturn } from "@/actions/Types";
import { ExpandedOmegaMembershipGroup } from "./Types";
import { readGroup, readGroups } from "@/server/groups/read";

export async function readInterestGroups(): Promise<ActionReturn<ExpandedOmegaMembershipGroup[]>> {
    return readGroups('OMEGA_MEMBERSHIP_GROUP')
}

export async function readInterestGroup(id: number): Promise<ActionReturn<ExpandedOmegaMembershipGroup>> {
    return readGroup(id, 'OMEGA_MEMBERSHIP_GROUP')
}