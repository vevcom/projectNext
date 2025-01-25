export type Page<PageSize extends number, Cursor> = {
    readonly pageSize: PageSize,
} &
({
    page: number,
    cursor: Cursor
} | {
    page: 0,
    cursor: null
})

export type ReadPageInput<PageSize extends number, Cursor, InputDetails = undefined> = {
    page: Page<PageSize, Cursor>,
    details: InputDetails,
}
