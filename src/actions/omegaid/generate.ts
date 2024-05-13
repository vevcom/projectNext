"use server"

import { getUser } from "@/auth/getUser"
import { createActionError } from "../error"
import { ActionReturn } from "../Types"
import { generateOmegaId } from "@/server/omegaid/generate"


export async function generateOmegaIdAction(): Promise<ActionReturn<string>> {

    const { user, authorized, status } = await getUser({
        userRequired: true,
    })
    
    if (!authorized) return createActionError(status)

    const token = generateOmegaId(user)

    return {
        success: true,
        data: token,
    }
}