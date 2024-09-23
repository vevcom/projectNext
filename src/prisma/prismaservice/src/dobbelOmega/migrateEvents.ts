import type { PrismaClient as PrismaClientPn } from '@/generated/pn'
import type { PrismaClient as PrismaClientVeven } from '@/generated/veven'
import type { IdMapper } from './IdMapper'
import type { Limits } from './migrationLimits'

export default async function migrateEvents(
    pnPrisma: PrismaClientPn,
    vevenPrisma: PrismaClientVeven,
    limits: Limits
) {
    const events = await vevenPrisma.events.findMany({ take: limits.events ? limits.events : undefined })
}