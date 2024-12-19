import seedImages from './seedImages'
import seedDevUsers from './development/seedDevUsers'
import seedDevPermissions from './development/seedDevPermissions'
import seedDevImages from './development/seedDevImages'
import seedDevNews from './development/seedDevNews'
import seedDevLockers from './development/seedDevLockers'
import seedCms from './seedCms'
import seedDevOmegaquotes from './development/seedDevOmegaquotes'
import seedOrder from './seedOrder'
import SeedSpecialImageCollections from './SeedSpecialImageCollections'
import dobbelOmega from './dobbelOmega/dobbelOmega'
import seedNotificationChannels from './seedNotificationsChannels'
import seedDevGroups from './development/seedDevGroups'
import seedClasses from './seedClasses'
import SeedSpecialVisibility from './seedSpecialVisibility'
import seedMail from './seedMail'
import seedStudyProgramme from './seedStudyProgramme'
import seedOmegaMembershipGroups from './seedOmegaMembershipGroups'
import seedDevSchools from './development/seedDevSchools'
import seedDevCompanies from './development/seedDevCompanies'
import { PrismaClient } from '@/generated/pn'
import seedShop from './seedShop'
import seedDevShop from './development/seedDevShop'

async function seed() {
    const prisma = new PrismaClient()

    console.log('seeding standard data....')
    await seedOrder(prisma)
    await SeedSpecialVisibility(prisma)
    await SeedSpecialImageCollections(prisma)
    await seedImages(prisma)
    await seedCms(prisma)
    await seedMail(prisma)
    await seedNotificationChannels(prisma)
    await seedStudyProgramme(prisma)
    await seedOmegaMembershipGroups(prisma)
    await seedClasses(prisma)
    await seedShop(prisma)
    console.log('seed standard done')

    const shouldMigrate = process.env.MIGRATE_FROM_VEVEN === 'true'
    console.log(shouldMigrate ? 'migrating from veven' : 'not migrating from veven')
    if (shouldMigrate) await dobbelOmega(prisma)

    if (process.env.NODE_ENV !== 'development') return
    console.log('seeding dev data....')
    await seedDevImages(prisma)
    await seedDevUsers(prisma)
    await seedDevGroups(prisma)
    await seedDevPermissions(prisma)
    await seedDevOmegaquotes(prisma)
    await seedDevNews(prisma)
    await seedDevLockers(prisma)
    await seedDevSchools(prisma)
    await seedDevCompanies(prisma)
    await seedDevShop(prisma)
    console.log('seed dev done')
}

seed().then(() => console.log('exiting'))
