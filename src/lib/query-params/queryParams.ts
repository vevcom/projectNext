import { StringArrayQueryParam } from './QueryParam'
import type { QueryParam } from './QueryParam'
export const QueryParams = {
    eventTags: new StringArrayQueryParam('event-tags'),
} as const satisfies Record<string, QueryParam<string | string[] | number | number[]>>

export type QueryParamNames = typeof QueryParams[keyof typeof QueryParams]['name']
