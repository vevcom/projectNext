export type SearchParamsServerSide = {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}
