'use server'
import { readVisibilityCollapsed } from "@/server/visibility/read"
import { safeServerCall } from "../safeServerCall"
import { readGroupsStructured } from "@/server/groups/read"
import { ActionReturn } from "../Types"
import { createActionError } from "../error"
import { GroupType, VisibilityPurpose, VisibilityType } from "@prisma/client"
import { checkVisibility } from "@/auth/checkVisibility"
import { getUser } from "@/auth/getUser"
import { ExpandedGroup, GroupsStructured } from "@/server/groups/Types"
import { PurposeTextsConfig } from "@/server/visibility/ConfigVars"
import { GroupMatrix } from "@/server/visibility/Types"

type VisibilityRequiermentForAdmin = (ExpandedGroup & {
    selected: boolean
})[]

type VisibilityStructuredForAdmin = {
    purpose: string
} & (
    {
        type: 'REGULAR'
        groups: GroupsStructured
        regular: VisibilityRequiermentForAdmin[]
        admin: VisibilityRequiermentForAdmin[]
    } | {
        type: 'SPECIAL'
        message: string
        regular: string
        admin: string
    }
)

export async function readVisibilityForAdminAction(id: number) : Promise<ActionReturn<VisibilityStructuredForAdmin>> {
    const [visibilityRes, groupsRes]  = await Promise.all([
        safeServerCall(() => readVisibilityCollapsed(id)),
        safeServerCall(() => readGroupsStructured())
    ])
    if (!visibilityRes.success || !groupsRes.success) return createActionError('UNKNOWN ERROR', 'noe gikk galt')
    
        
    const visibility = visibilityRes.data
    const groups = groupsRes.data
    const purpose = PurposeTextsConfig[visibility.purpose]

    if (!checkVisibility(await getUser(), visibility, 'ADMIN')) {
        return createActionError('UNAUTHORIZED', 'You do not have permission to admin this collection')
    }
    if (visibility.type === 'SPECIAL') return {
        success: true,
        data: {
            purpose,
            type: 'SPECIAL',
            message: `Denne visibility er spessiell`,
            regular: `Folk med ${visibility.regular} har vanlig tilgang`,
            admin: `Folk med ${visibility.admin} har admin tilgang`,
        }
    }
    return {
        success: true,
        data: {
            purpose,
            type: 'REGULAR',
            regular: expandOneLevel(visibility.regular, groups),
            admin: expandOneLevel(visibility.admin, groups),
            groups,
        }
    }
}

const standardGroupings = ['CLASS','OMEGA_MEMBERSHIP_GROUP', 'STUDY_PROGRAMME'] satisfies GroupType[]

function expandOneLevel(matrix: GroupMatrix, groups: GroupsStructured) : VisibilityRequiermentForAdmin[] {
    const res : VisibilityRequiermentForAdmin[] = []
    standardGroupings.forEach(groupType => {
        console.log(groupType)
        console.log(groups)
    })

    return res
}