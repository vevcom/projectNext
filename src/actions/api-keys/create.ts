'use server'

import { ApiKeyFilteredWithKey } from "@/server/api-keys/Types";
import { ActionReturn } from "../Types";
import { createApiKeyValidation, type CreateApiKeyTypes } from "@/server/api-keys/validation";
import { getUser } from "@/auth/getUser";
import { createActionError, createZodActionError } from "../error";
import { safeServerCall } from "../safeServerCall";
import { createApiKey } from "@/server/api-keys/create";

export async function createApiKeyAction(rawdata: FormData | CreateApiKeyTypes['Type']): Promise<ActionReturn<ApiKeyFilteredWithKey>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['APIKEY_ADMIN']]
    })
    if (!authorized) return createActionError(status)
    const parse = createApiKeyValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createApiKey(data))
}