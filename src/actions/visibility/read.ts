'use server'

import { readVisibilityCollapsed } from "@/server/visibility/read"
import { safeServerCall } from "../safeServerCall"
import { readGroupsStructured } from "@/server/groups/read"

export async function readExtendedVisibility(id: number) {
    const visibilityC = await safeServerCall(() => readVisibilityCollapsed(id))
    const groupsStructured = await safeServerCall(() => readGroupsStructured())
}