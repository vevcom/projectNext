'use server'
import { action } from '@/actions/action'
import { apiKeyMethods } from '@/services/api-keys/methods'

export const readApiKeysAction = action(apiKeyMethods.readMany)
export const readApiKeyAction = action(apiKeyMethods.read)
