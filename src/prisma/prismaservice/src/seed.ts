import seedImages from './seedImages'
import seedDevUsers from './development/seedDevUsers'
import seedDevImages from './development/seedDevImages'
import seedCms from './seedCms'
import seedDevOmegaquotes from './development/seedDevOmegaquotes'
import { PrismaClient } from '@prisma/client'

async function seed() {
    const prisma = new PrismaClient()

    console.log('seeding standard data....')
    await seedImages(prisma)
    await seedCms(prisma)
    console.log('seed standard done')

    if (process.env.NODE_ENV !== 'development') return
    console.log('seeding dev data....')
    await seedDevUsers(prisma)
    await seedDevImages(prisma)
    await seedDevOmegaquotes(prisma)
    console.log('seed dev done')
}

seed().then(() => console.log('exiting'))
