import 'server-only'
import { ActionReturn } from "@/actions/Types";
import { ExpandedStudyProgramme } from "./Types";
import { readGroup, readGroups } from "@/server/groups/read";

export async function readInterestGroups(): Promise<ActionReturn<ExpandedStudyProgramme[]>> {
    return readGroups('STUDY_PROGRAMME')
}

export async function readInterestGroup(id: number): Promise<ActionReturn<ExpandedStudyProgramme>> {
    return readGroup(id, 'STUDY_PROGRAMME')
}