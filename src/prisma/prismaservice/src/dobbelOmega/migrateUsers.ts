import type { PrismaClient as PrismaClientPn } from '@/generated/pn'
import type { PrismaClient as PrismaClientVeven } from '@/generated/veven'
import type { Limits } from './migrationLimits'

/**
 * This function migrates users from Veven to PN
 * @param pnPrisma - PrismaClientPn
 * @param vevenPrisma - PrismaClientVeven
 * @param limits - Limits - used to limit the number of users to migrate
 */
export default async function migrateUsers(
    pnPrisma: PrismaClientPn,
    vevenPrisma: PrismaClientVeven,
    limits: Limits,
) {

}