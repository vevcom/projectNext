'use server'
import { action } from '@/actions/action'
import { createApiKey } from '@/services/api-keys/create'

export const createApiKeyAction = action(createApiKey)
