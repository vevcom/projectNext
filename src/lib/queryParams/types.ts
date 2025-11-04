
/**
 * @deprecated this type is not needed since ServerPage automatically types searchParams
 */
export type SearchParamsServerSide = {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}
