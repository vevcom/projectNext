import 'server-only'
import { ActionReturn } from "@/actions/Types";
import { SpecificGroupUpdateInput } from "@/server/groups/Types";
import { updateGroup } from "@/server/groups/update";
import { ExpandedOmegaMembershipGroup } from "./Types";

type UpdateOmegaMembershipGroupArgs = SpecificGroupUpdateInput<'OMEGA_MEMBERSHIP_GROUP'>

export async function updateInterestGroup(id: number, data: UpdateOmegaMembershipGroupArgs): Promise<ActionReturn<ExpandedOmegaMembershipGroup>> {
    return updateGroup(id, 'OMEGA_MEMBERSHIP_GROUP', data)
}