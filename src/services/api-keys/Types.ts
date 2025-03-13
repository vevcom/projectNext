import type { ApiKeyConfig } from './config'
import type { ApiKey } from '@prisma/client'

export type ApiKeyFiltered = Pick<ApiKey, typeof ApiKeyConfig.fieldsToExpose[number]>

export type ApiKeyFilteredWithKey = ApiKeyFiltered & {
    key: string
}
