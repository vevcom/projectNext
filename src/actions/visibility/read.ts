'use server'

import { readVisibilityCollapsed } from "@/server/visibility/read"
import { safeServerCall } from "../safeServerCall"
import { readGroupsStructured } from "@/server/groups/read"

export async function readExtendedVisibility(id: number) {
    const [visibilityRes, groupsRes]  = await Promise.all([
        safeServerCall(() => readVisibilityCollapsed(id)),
        safeServerCall(() => readGroupsStructured())
    ])

    
}