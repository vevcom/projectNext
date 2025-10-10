'use server'

import { makeAction } from '@/services/serverAction'
import { apiKeyOperations } from '@/services/api-keys/operations'

export const createApiKeyAction = makeAction(apiKeyOperations.create)

export const destroyApiKeyAction = makeAction(apiKeyOperations.destroy)

export const readApiKeysAction = makeAction(apiKeyOperations.readMany)
export const readApiKeyAction = makeAction(apiKeyOperations.read)

export const updateApiKeyAction = makeAction(apiKeyOperations.update)
