'use server'

import { action } from '@/services/action'
import { apiKeyMethods } from '@/services/api-keys/methods'

export const createApiKeyAction = action(apiKeyMethods.create)

export const destroyApiKeyAction = action(apiKeyMethods.destroy)

export const readApiKeysAction = action(apiKeyMethods.readMany)
export const readApiKeyAction = action(apiKeyMethods.read)

export const updateApiKeyAction = action(apiKeyMethods.update)
