import { ApiKey } from "@prisma/client"
import { apiKeyFieldsToExpose } from './ConfigVars'

export type ApiKeyFiltered = Pick<ApiKey, typeof apiKeyFieldsToExpose[number]>

export type ApiKeyFilteredWithKey = ApiKeyFiltered & {
    key: string
}