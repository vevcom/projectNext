'use server'
import { action } from '@/actions/action'
import { updateApiKey } from '@/services/api-keys/update'

export const updateApiKeyAction = action(updateApiKey)
