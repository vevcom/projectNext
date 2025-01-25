import { z } from 'zod'

export function readPageInputSchema<PageSize extends number, Cursor, Details>(
    pageSize: z.ZodType<PageSize>,
    cursor: z.ZodType<Cursor>,
    details: z.ZodType<Details>,
) {
    const page = z.union([
        z.object({
            pageSize,
            page: z.number(),
            cursor,
        }),
        z.object({
            pageSize,
            page: z.literal(0),
            cursor: z.literal(null),
        }),
    ]).refine(
        data => cursor !== null || data.page === 0,
        {
            message: 'With null as cursor, page must be 0.',
        },
    )

    return z.object({
        page,
        details,
    })
}

export function readPageInputSchemaObject<PageSize extends number, Cursor, Details>(
    pageSize: z.ZodType<PageSize>,
    cursor: z.ZodType<Cursor>,
    details: z.ZodType<Details>,
) {
    return z.object({
        paging: readPageInputSchema(pageSize, cursor, details),
    })
}
