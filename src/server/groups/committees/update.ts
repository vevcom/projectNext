import 'server-only'
import { ActionReturn } from "@/actions/Types";
import { SpecificGroupUpdateInput } from "@/server/groups/Types";
import { updateGroup } from "@/server/groups/update";
import { ExpandedCommittee } from "./Types";

type UpdateCommitteeArgs = SpecificGroupUpdateInput<'COMMITTEE'>

export async function updateCommittee(id: number, data: UpdateCommitteeArgs): Promise<ActionReturn<ExpandedCommittee>> {
    return updateGroup(id, 'COMMITTEE', data)
}