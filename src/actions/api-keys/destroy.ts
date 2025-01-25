'use server'
import { action } from '@/actions/action'
import { destroyApiKey } from '@/services/api-keys/destroy'

export const destroyApiKeyAction = action(destroyApiKey)
