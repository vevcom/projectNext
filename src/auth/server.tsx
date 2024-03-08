import type { Permission } from "@prisma/client"
import { getUser } from "."
import { RequireUserClient } from "./client"

type PropTypes = {
    children: React.ReactNode
    requiredPermissions?: Permission[]
}

export async function RequireUserServer({ children, requiredPermissions }: PropTypes) {
    const { authorized } = await getUser({ requiredPermissions })    

    return <RequireUserClient>
        {(authorized && children) ?? 'man burde ikke kunne se dette'}
    </RequireUserClient>
}
