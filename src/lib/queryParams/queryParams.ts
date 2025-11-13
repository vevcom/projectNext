import { BooleanQueryParam, NumberQueryParam, StringArrayQueryParam, StringQueryParam } from './QueryParam'
import type { QueryParam } from './QueryParam'
export const QueryParams = {
    eventTags: new StringArrayQueryParam('event-tags'),
    onlyActive: new BooleanQueryParam('only-active'),
    userId: new NumberQueryParam('user-id'),
    companyName: new StringQueryParam('company-name'),
    token: new StringQueryParam('token'),
    callbackUrl: new StringQueryParam('callbackUrl'),
} as const satisfies Record<string, QueryParam<string | string[] | number | number[] | boolean>>

export type QueryParamNames = typeof QueryParams[keyof typeof QueryParams]['name']
