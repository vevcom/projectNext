'use server'

import { CreateSchoolTypes } from "@/services/schools/validation";
import { ActionReturn } from "../Types";

export async function createSchoolAction(rawdata: FormData | CreateSchoolTypes['Type']): Promise<ActionReturn<>> {

}