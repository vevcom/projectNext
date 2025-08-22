'use server'

import { action } from '@/actions/action'
import { ApiKeyMethods } from '@/services/api-keys/methods'

export const createApiKeyAction = action(ApiKeyMethods.create)

export const destroyApiKeyAction = action(ApiKeyMethods.destroy)

export const readApiKeysAction = action(ApiKeyMethods.readMany)
export const readApiKeyAction = action(ApiKeyMethods.read)

export const updateApiKeyAction = action(ApiKeyMethods.update)
