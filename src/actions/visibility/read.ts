'use server'
import { readVisibilityCollapsed } from "@/server/visibility/read"
import { safeServerCall } from "../safeServerCall"
import { readGroupsStructured } from "@/server/groups/read"
import { ActionReturn } from "../Types"
import { createActionError } from "../error"
import { VisibilityPurpose, VisibilityType } from "@prisma/client"
import { checkVisibility } from "@/auth/checkVisibility"
import { getUser } from "@/auth/getUser"

type VisibilityStructuredForAdmin = {
    type: VisibilityType
    purpose: VisibilityPurpose
}

export async function readVisibilityForAdminAction(id: number) : Promise<ActionReturn<>> {
    const [visibilityRes, groupsRes]  = await Promise.all([
        safeServerCall(() => readVisibilityCollapsed(id)),
        safeServerCall(() => readGroupsStructured())
    ])
    if (!visibilityRes.success || !groupsRes.success) return createActionError('UNKNOWN ERROR', 'noe gikk galt')
    
        
    const visibility = visibilityRes.data
    const groups = groupsRes.data
    if (!checkVisibility(await getUser(), visibility, 'ADMIN')) {
        return createActionError('UNAUTHORIZED', 'You do not have permission to admin this collection')
    }

}