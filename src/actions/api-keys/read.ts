'use server'
import { action } from '@/actions/action'
import { ApiKeyMethods } from '@/services/api-keys/methods'

export const readApiKeysAction = action(ApiKeyMethods.readMany)
export const readApiKeyAction = action(ApiKeyMethods.read)
