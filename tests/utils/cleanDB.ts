import prisma from "@/prisma";

export default async function cleanDB(table: string) {
  try {
    await prisma.$queryRaw`SELECT 1 FROM "${table}" LIMIT 1`;

    await prisma.$executeRaw`DROP TABLE IF EXISTS "${table}" CASCADE`;
  } catch (error) {
    throw new Error(`The table "${table}" does not exist.`);
  }
}