import { QueryParam, StringArrayQueryParam } from "./QueryParam";
export const QueryParams = {
    eventTags: new StringArrayQueryParam('event-tags'),
}  as const satisfies Record<string, QueryParam<any>>

export type QueryParamNames = typeof QueryParams[keyof typeof QueryParams]['name']