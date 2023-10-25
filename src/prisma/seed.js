import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const harambe = await prisma.user.upsert({
    create: {
      email: 'harambe@harambesen.io',
    },
  })
  console.log({ alice })
}
main().then(async () => {
    await prisma.$disconnect()
}).catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})