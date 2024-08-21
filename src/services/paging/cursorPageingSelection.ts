import 'server-only'
import type { Page } from '@/server/paging/Types'

/**
 * A function to generate the cursor-paging selection for a given page
 * If the page has a cursor, it will return the cursor and take the pageSize
 * If the page does not have a cursor, it will fallback to offset pagination
 * @param page - the page to cursor-paginate
 * @returns
 */
export function cursorPageingSelection<const PageSize extends number, Cursor>(
    page: Page<PageSize, Cursor>
): {
    take: number,
    skip: number,
    cursor?: Cursor,
} {
    return page.cursor ? {
        cursor: page.cursor,
        take: page.pageSize,
        skip: 1,
    } : {
        take: page.pageSize,
        skip: page.page * page.pageSize,
    }
}
