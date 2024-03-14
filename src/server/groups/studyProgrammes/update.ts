import 'server-only'
import { ActionReturn } from "@/actions/Types";
import { SpecificGroupUpdateInput } from "@/server/groups/Types";
import { updateGroup } from "@/server/groups/update";
import { ExpandedStudyProgramme } from "./Types";

type UpdateStudyProgrammeArgs = SpecificGroupUpdateInput<'STUDY_PROGRAMME'>

export async function updateInterestGroup(id: number, data: UpdateStudyProgrammeArgs): Promise<ActionReturn<ExpandedStudyProgramme>> {
    return updateGroup(id, 'STUDY_PROGRAMME', data)
}