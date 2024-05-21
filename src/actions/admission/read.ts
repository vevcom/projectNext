"use server"

import { getUser } from "@/auth/getUser"
import { createActionError } from "../error"
import { ActionReturn } from "../Types"
import { Admissions } from "@prisma/client"
import { safeServerCall } from "../safeServerCall"
import { readAdmission, readAllAdmissions } from "@/server/admission/read"


export async function readAllAdmissionsAction(): Promise<ActionReturn<Admissions[]>> {

    const { authorized, status} = await getUser({
        requiredPermissions: [[ 'ADMISSION_READ' ]]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readAllAdmissions())
}

export async function readAdmissionAction(id: number): Promise<ActionReturn<Admissions>> {

    const { authorized, status} = await getUser({
        requiredPermissions: [[ 'ADMISSION_READ' ]]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readAdmission(id))
}