'use server'
import { action } from '@/actions/action'
import { ApiKeyMethods } from '@/services/api-keys/methods'

export const updateApiKeyAction = action(ApiKeyMethods.update)
