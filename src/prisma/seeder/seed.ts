import logger from '@/lib/logger'
import seed from './src/seed'
import { prisma } from '@/prisma-pn-client-instance'
import { exit } from 'process'

process.env.SEED = 'true'

seed(
    process.env.MIGRATE_FROM_OW === 'true',
    process.env.NODE_ENV === 'development'
)
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        logger.error(e)
        await prisma.$disconnect()
        exit(1)
    }).then(() => logger.info('Seeding finished.'))
