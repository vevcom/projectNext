import seed from './src/seeder'
import { prisma } from '@/prisma/client'
import { exit } from 'process'

seed(
    process.env.MIGRATE_FROM_VEVEN === 'true',
    process.env.NODE_ENV === 'development'
)
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        exit(1)
    }).then(() => console.log('Seeding finished'))
