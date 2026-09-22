import { seedDevUsers } from './development/seedDevUsers'
import seedDevPermissions from './development/seedDevPermissions'
import { seedDevImages } from './development/seedDevImages'
import { seedDevNews } from './development/seedDevNews'
import seedDevLockers from './development/seedDevLockers'
import seedDevOmegaquotes from './development/seedDevOmegaquotes'
import { seedOrders } from './standardContent/seedOrders'
import dobbelOmega from './dobbelOmega/dobbelOmega'
import seedNotificationChannels from './seedNotificationsChannels'
import seedDevGroups from './development/seedDevGroups'
import seedClasses from './seedClasses'
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
import seedPermissions from './seedPermissions'
import seedDevApplicationsAndPeriods from './development/seedDevApplicationsAndPeriods'
import { seedArticleCategories } from './standardContent/seedArticleCategories'
import { seedImages } from './standardContent/seedImages'
import { seedSpecialCms } from './standardContent/seedSpecialCms'
import { seedFlairs } from './standardContent/seedFlairs'
import { seedNews } from './standardContent/seedNews'
import seedInterestGroups from './seedInterestGroups'
import { createTimedStep } from './timedStep'
import { withServiceContext } from '@/services/serviceOperation'
import { Session } from '@/auth/session/Session'

export default async function seed(
    shouldMigrate: boolean,
    seedDevData: boolean,
    logging?: boolean,
) {
    const { step, finish } = createTimedStep(logging ?? true)

    //TODO: Remove this outer withServiceContext.
    //TODO: When all seeders are refactored to use defineSeedOperation it will not
    //TODO: be neccesary as defineSeedOperation will handle the service context.
    await step('Upserting standard data', () => withServiceContext({
        bypassAuth: true,
        session: Session.empty(),
    }, true, async ({ prisma }) => {
        await step('Upserting standard orders', () => seedOrders())
        await step('Upserting standard images', () => seedImages())
        await step('Upserting standard special CMS', () => seedSpecialCms())
        await step('Upserting standard article categories', () => seedArticleCategories())
        await step('Upserting standard news', () => seedNews())
        await step('Upserting standard mail', () => seedMail(prisma))
        await step('Upserting standard notification channels', () => seedNotificationChannels(prisma))
        await step('Upserting standard study programmes', () => seedStudyProgramme(prisma))
        await step('Upserting standard omega membership groups', () => seedOmegaMembershipGroups(prisma))
        await step('Upserting standard classes', () => seedClasses(prisma))
        await step('Upserting standard cabins', () => seedCabin(prisma))
        await step('Upserting standard shops', () => seedShop(prisma))
        await step('Upserting standard events', () => seedEvents(prisma))
        await step('Upserting standard permissions', () => seedPermissions(prisma))
        await step('Upserting standard flairs', () => seedFlairs())
        await step('Upserting standard interest groups', () => seedInterestGroups(prisma))

        if (!shouldMigrate) return
        await step('Migrating from Veven', () => dobbelOmega(prisma))
    }))

    if (!seedDevData || shouldMigrate) {
        finish()
        return
    }

    //TODO: Remove this outer withServiceContext. (see above)
    await step('Seeding development data', () => withServiceContext({
        bypassAuth: true,
        session: Session.empty(),
    }, true, async ({ prisma }) => {
        await step('Seeding development images', () => seedDevImages())
        await step('Seeding development groups', () => seedDevGroups(prisma))
        await step('Seeding development users', () => seedDevUsers())
        await step('Seeding development permissions', () => seedDevPermissions(prisma))
        await step('Seeding development omega quotes', () => seedDevOmegaquotes(prisma))
        await step('Seeding development news', () => seedDevNews())
        await step('Seeding development lockers', () => seedDevLockers(prisma))
        await step('Seeding development schools', () => seedDevSchools(prisma))
        await step('Seeding development companies', () => seedDevCompanies(prisma))
        await step('Seeding development job ads', () => seedDevJobAds(prisma))
        await step('Seeding development shops', () => seedDevShop(prisma))
        await step('Seeding development events', () => seedDevEvents(prisma))
        await step('Seeding development applications and periods', () => seedDevApplicationsAndPeriods(prisma))
    }))

    finish()
}
