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
import seedShop from './seedShop'
import seedDevShop from './development/seedDevShop'
import seedDevJobAds from './development/seedDevJobAds'
import seedDevEvents from './development/seedDevEvents'
import seedEvents from './seedEvent'
import seedCabin from './seedCabin'
import { PrismaClient } from '@prisma/client'
import seedPermissions from './seedPermissions'

export default async function seed(
    shouldMigrate: boolean,
    seedDevData: boolean,
    logging?: boolean,
) {
    const enableLogging = logging === undefined ? true : logging
    const prisma = new PrismaClient()

    if (enableLogging) console.log('seeding standard data....')
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
    await seedCabin(prisma)
    await seedShop(prisma)
    await seedEvents(prisma)
    await seedPermissions(prisma)
    if (enableLogging) console.log('seed standard done')

    if (enableLogging) console.log(shouldMigrate ? 'migrating from veven' : 'not migrating from veven')
    if (shouldMigrate) await dobbelOmega(prisma)

    if (!seedDevData || shouldMigrate) return
    if (enableLogging) console.log('seeding dev data....')
    await seedDevImages(prisma)
    await seedDevUsers(prisma)
    await seedDevGroups(prisma)
    await seedDevPermissions(prisma)
    await seedDevOmegaquotes(prisma)
    await seedDevNews(prisma)
    await seedDevLockers(prisma)
    await seedDevSchools(prisma)
    await seedDevCompanies(prisma)
    await seedDevJobAds(prisma)
    await seedDevShop(prisma)
    await seedDevEvents(prisma)
    console.log('seed dev done')
}
