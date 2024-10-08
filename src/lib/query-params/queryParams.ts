type QueryParam = {
    name: string,
} & (
{
    type: 'string',
    navigateTo: (value: string) => string
} | 
{
    type: 'string-array',
    navigateTo: (value: string[]) => string
})


export const QueryParams = {
    eventTags: {
        name: 'event-tags',
        type: 'string-array',
        navigateTo: (tags: string[]) => `/events?event-tags=${tags.map(encodeURIComponent).join(',')}`,
    }
}  as const satisfies Record<string, QueryParam>