import 'server-only'
import { ActionReturn } from "@/actions/Types";
import { SpecificGroupUpdateInput } from "@/server/groups/Types";
import { updateGroup } from "@/server/groups/update";
import { ExpandedInterestGroup } from "./Types";

type UpdateInterestGroupArgs = SpecificGroupUpdateInput<'INTEREST_GROUP'>

export async function updateInterestGroup(id: number, data: UpdateInterestGroupArgs): Promise<ActionReturn<ExpandedInterestGroup>> {
    return updateGroup(id, 'INTEREST_GROUP', data)
}