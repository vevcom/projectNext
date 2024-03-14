import 'server-only'
import { ActionReturn } from "@/actions/Types";
import { SpecificGroupUpdateInput } from "@/server/groups/Types";
import { updateGroup } from "@/server/groups/update";
import { ExpandedClass } from "./Types";

type UpdateClassArgs = SpecificGroupUpdateInput<'CLASS'>

export async function updateClass(id: number, data: UpdateClassArgs): Promise<ActionReturn<ExpandedClass>> {
    return updateGroup(id, 'CLASS', data)
}