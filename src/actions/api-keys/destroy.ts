'use server'
import { action } from '@/actions/action'
import { apiKeyMethods } from '@/services/api-keys/methods'

export const destroyApiKeyAction = action(apiKeyMethods.destroy)
