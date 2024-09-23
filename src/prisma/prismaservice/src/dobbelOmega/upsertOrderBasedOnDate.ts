import type { PrismaClient as PrismaClientPn } from '@/generated/pn'

/**
 * Veven did not have the consept of omegaOrder. This function infers the order based on a date and
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
    await pnPrisma.omegaOrder.upsert({
        where: {
            order: orderPublished,
        },
        update: {
            order: orderPublished,
        },
        create: {
            order: orderPublished,
        }
    })
    return orderPublished
}