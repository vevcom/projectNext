import type { apiKeysConfig } from './config'
import type { ApiKey } from '@prisma/client'

export type ApiKeyFiltered = Pick<ApiKey, typeof apiKeysConfig.fieldsToExpose[number]>

export type ApiKeyFilteredWithKey = ApiKeyFiltered & {
    key: string
}
