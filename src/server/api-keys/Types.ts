import type { apiKeyFieldsToExpose } from './ConfigVars'
import type { ApiKey } from '@prisma/client'

export type ApiKeyFiltered = Pick<ApiKey, typeof apiKeyFieldsToExpose[number]>

export type ApiKeyFilteredWithKey = ApiKeyFiltered & {
    key: string
}
