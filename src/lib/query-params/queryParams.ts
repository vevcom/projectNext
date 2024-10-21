import { BooleanQueryParam, NumberQueryParam, StringArrayQueryParam } from './QueryParam'
import type { QueryParam } from './QueryParam'
export const QueryParams = {
    eventTags: new StringArrayQueryParam('event-tags'),
    onlyActive: new BooleanQueryParam('only-active'),
    userId: new NumberQueryParam('user-id'),
} as const satisfies Record<string, QueryParam<string | string[] | number | number[] | boolean>>

export type QueryParamNames = typeof QueryParams[keyof typeof QueryParams]['name']
