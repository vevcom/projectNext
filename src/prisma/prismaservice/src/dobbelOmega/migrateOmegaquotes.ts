import type { PrismaClient as PrismaClientPn } from '@/generated/pn'
import type { PrismaClient as PrismaClientVeven } from '@/generated/veven'
import type { Limits } from './migrationLimits'

export default async function migrateOmegaquotes(
    pnPrisma: PrismaClientPn, 
    vevenPrisma: PrismaClientVeven,
    limits: Limits
) {

}
    