'use server'
import { action } from '@/actions/action'
import { readApiKey, readApiKeys } from '@/services/api-keys/read'

export const readApiKeysAction = action(readApiKeys)
export const readApiKeyAction = action(readApiKey)
