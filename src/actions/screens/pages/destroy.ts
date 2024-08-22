import { createActionError } from "@/actions/error";
import { safeServerCall } from "@/actions/safeServerCall";
import { ActionReturn } from "@/actions/Types";
import { getUser } from "@/auth/getUser";
import { destroyPage } from "@/server/screens/pages/destroy";


export async function destroyPageAction(id: number) : Promise<ActionReturn<void>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['SCREEN_ADMIN']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => destroyPage(id))
}