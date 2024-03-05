import { PrismaClient as PrismaClientVeven } from '@/dobbelOmega'
import { PrismaClient as PrismaClientPn } from '@prisma/client'

export default async function dobbelOmega(pnPrisma: PrismaClientPn) {
    const vevenPrisma = new PrismaClientVeven()
}