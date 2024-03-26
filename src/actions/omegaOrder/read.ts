'use server'
import { OmegaOrder } from "@prisma/client";
import { ActionReturn } from "../Types";
import { getUser } from "@/auth/getUser";
import { createActionError } from "../error";
import { safeServerCall } from "../safeServerCall";
import { readCurrentOmegaOrder } from "@/server/omegaOrder/read";

export async function readCurrentOmegaOrderAction() : Promise<ActionReturn<OmegaOrder>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['OMEGA_ORDER_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readCurrentOmegaOrder())
}