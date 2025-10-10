'use server'

import { action } from '@/services/action'
import { apiKeyOperations } from '@/services/api-keys/operations'

export const createApiKeyAction = action(apiKeyOperations.create)

export const destroyApiKeyAction = action(apiKeyOperations.destroy)

export const readApiKeysAction = action(apiKeyOperations.readMany)
export const readApiKeyAction = action(apiKeyOperations.read)

export const updateApiKeyAction = action(apiKeyOperations.update)
