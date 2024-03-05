import { PrismaClient as PrismaClientVeven } from '@/generated/veven'
import type { PrismaClient as PrismaClientPn } from '@/generated/pn'
import migrateOmbul from './migrateOmbul'

export default async function dobbelOmega(pnPrisma: PrismaClientPn) {
    const vevenPrisma = new PrismaClientVeven()
    await migrateOmbul(pnPrisma, vevenPrisma)
}