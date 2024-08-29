'use server'
import { getUser } from "@/auth/getUser"
import { createActionError } from "../error"
import { readSchool, readSchools, readStandardSchools } from "@/services/schools/read"
import { safeServerCall } from "../safeServerCall"
import { ActionReturn } from "../Types"
import { SchoolFiltered } from "@/services/schools/Types"

export async function readSchoolsPageAction() {

}

export async function readStandardSchoolsAction() : Promise<ActionReturn<SchoolFiltered[]>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['SCHOOLS_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readStandardSchools())
}

export async function readSchoolsAction() : Promise<ActionReturn<SchoolFiltered[]>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['SCHOOLS_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readSchools())
}