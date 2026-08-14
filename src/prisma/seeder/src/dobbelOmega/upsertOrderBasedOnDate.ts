import { Prisma } from '@/prisma-generated-pn-client'
import type { PrismaClient as PrismaClientPn } from '@/prisma-generated-pn-client'

/**
 * Upserts an OmegaOrder row for the given order number.
 *
 * Prisma's query-compiler runtime does not compile `upsert` into a single atomic
 * `INSERT ... ON CONFLICT` here - it's a separate check-then-write, so concurrent calls for
 * the same order (e.g. many users/articles from the same year migrating in parallel via
 * Promise.all) can both decide to create and race each other. A unique constraint hit in
 * that case just means another concurrent call already created the row, which is exactly
 * what we wanted, so it's swallowed rather than treated as a failure.
 */
export async function upsertOmegaOrder(pnPrisma: PrismaClientPn, order: number): Promise<void> {
    try {
        await pnPrisma.omegaOrder.upsert({
            where: { order },
            update: {},
            create: { order },
        })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return
        }
        throw error
    }
}

/**
 * Omegaweb-basic did not have the consept of omegaOrder. This function infers the order based on a date and
 * also upserts the order into the database.
 * @param date - Date of thing
 */
export default async function upsertOrderBasedOnDate(
    pnPrisma: PrismaClientPn,
    date: Date
): Promise<number> {
    // The order is assumed to change 1. september, calculate by createdAt
    // 1. september 1914 = order 1, 1. september 1915 = order 2, ...
    let orderPublished = new Date(date).getFullYear() - 1914
    if (new Date(date).getMonth() < 8) {
        orderPublished--
    }
    await upsertOmegaOrder(pnPrisma, orderPublished)
    return orderPublished
}
