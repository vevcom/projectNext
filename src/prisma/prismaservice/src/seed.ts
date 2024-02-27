import seedImages from './seedImages'
import seedDevUsers from './development/seedDevUsers'
import seedDevPermissions from './development/seedDevPermissions'
import seedDevImages from './development/seedDevImages'
import seedDevNews from './development/seedDevNews'
import seedCms from './seedCms'
import seedDevOmegaquotes from './development/seedDevOmegaquotes'
import seedOrder from './seedOrder'
import { PrismaClient } from '@prisma/client'
import SeedSpecialImageCollections from './SeedSpecialImageCollections'

async function seed() {
    const prisma = new PrismaClient()

    console.log('seeding standard data....')
    await seedOrder(prisma)
    await SeedSpecialImageCollections(prisma)
    await seedImages(prisma)
    await seedCms(prisma)
    console.log('seed standard done')

    if (process.env.NODE_ENV !== 'development') return
    console.log('seeding dev data....')
    await seedDevUsers(prisma)
    await seedDevPermissions(prisma)
    await seedDevImages(prisma)
    await seedDevOmegaquotes(prisma)
    await seedDevNews(prisma)
    console.log('seed dev done')
}

seed().then(() => console.log('exiting'))
